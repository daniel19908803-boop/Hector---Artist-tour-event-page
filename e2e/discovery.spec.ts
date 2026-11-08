import {test,expect,type Page} from '@playwright/test';
import {formatInTimeZone,fromZonedTime} from '../apps/web/node_modules/date-fns-tz/dist/esm/index.js';

async function visit(page:Page,path:string){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
const allCount=async(page:Page)=>Number(await page.getByRole('button',{name:/^All \d+/}).locator('span').textContent());

test.beforeEach(async({page})=>{
  await page.route('https://www.openstreetmap.org/**',r=>r.fulfill({status:200,contentType:'text/html',body:'Map preview'}));
});

test('hero search submits on Enter and loads text, time and genre filters',async({page})=>{
  await visit(page,'/');
  await page.getByLabel('Search',{exact:true}).fill('vexa');
  await page.getByLabel('When',{exact:true}).selectOption('week');
  await page.getByLabel('Genre',{exact:true}).selectOption('Electronic');
  await page.getByLabel('Search',{exact:true}).press('Enter');
  await expect(page).toHaveURL(/\/events\?q=vexa&when=week&genre=Electronic/);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.getByLabel('Search artists, venues, or cities')).toHaveValue('vexa');
  await expect(page.getByLabel('Genre',{exact:true})).toHaveValue('Electronic');
  await expect(page.getByRole('button',{name:/^This week/})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.event-row')).toHaveCount(1);
  await expect(page.locator('.event-row h3')).toHaveText('VEXA');
});

test('homepage caps cards at six and See all agrees with All and the events page',async({page})=>{
  await visit(page,'/');
  const count=await allCount(page);
  await expect(page.locator('.event-row')).toHaveCount(Math.min(6,count));
  const link=page.getByRole('link',{name:`See all ${count} upcoming shows →`,exact:true});
  await expect(link).toHaveAttribute('href','/events');
  await link.click();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  expect(await allCount(page)).toBe(count);
  await expect(page.locator('.event-row')).toHaveCount(count);
});

test('expiration updates cards, tab counts and See all without a rebuild',async({page})=>{
  await visit(page,'/');
  const end=await page.locator('.event-row').first().getAttribute('data-ends-at');
  const href=await page.locator('.event-row h3 a').first().getAttribute('href');
  await page.clock.install({time:new Date(Date.parse(end!)-1000)});
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  const count=await allCount(page);
  const dateCounts=await Promise.all(['Tonight','This week','This month'].map(async label=>({label,count:Number(await page.getByRole('button',{name:new RegExp(`^${label}`)}).locator('span').textContent())})));
  await page.clock.runFor(1001);
  await expect.poll(()=>allCount(page)).toBe(count-1);
  for(const bucket of dateCounts)await expect(page.getByRole('button',{name:new RegExp(`^${bucket.label}`)}).locator('span')).toHaveText(String(bucket.count-1));
  await expect(page.locator(`.event-row h3 a[href="${href}"]`)).toHaveCount(0);
  await expect(page.getByRole('link',{name:`See all ${count-1} upcoming shows →`,exact:true})).toBeVisible();
  await expect(page.locator('.event-row')).toHaveCount(Math.min(6,count-1));
});

test('countdown matches local calendar days on home, openings and the venue page',async({page,request})=>{
  for(const route of ['/','/openings','/venues/the-foundry-hall']){
    await visit(page,route);
    const countdown=page.locator('[data-opening-date]');
    const label=await countdown.evaluate(el=>{
      const element=el as HTMLElement;
      const zone=element.dataset.openingTimezone!;
      const day=(date:Date)=>{
        const parts=new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
        const get=(name:string)=>Number(parts.find(part=>part.type===name)!.value);
        return Date.UTC(get('year'),get('month')-1,get('day'))/86400000;
      };
      const days=day(new Date(element.dataset.openingDate!))-day(new Date());
      return days>0?`${days} ${days===1?'day':'days'} to go`:days===0?'Opens tonight':'Now open';
    });
    await expect(countdown.locator('[data-opening-text]')).toHaveText(label);
    expect(await (await request.get(route)).text()).toContain(label);
  }
});

test('inline countdown rolls through opening day and now open between builds',async({page})=>{
  await visit(page,'/');
  const opening=await page.locator('[data-opening-date]').getAttribute('data-opening-date');
  const midnight=fromZonedTime(`${formatInTimeZone(opening!,'America/New_York','yyyy-MM-dd')}T00:00:00`,'America/New_York').getTime();
  await page.clock.install({time:new Date(midnight-30000)});
  await page.reload({waitUntil:'domcontentloaded'});
  const countdown=page.locator('[data-opening-date]');
  await expect(countdown.locator('[data-opening-text]')).toHaveText('1 day to go');
  await page.clock.runFor(60000);
  await expect(countdown.locator('[data-opening-text]')).toHaveText('Opens tonight');
  await expect(countdown.locator('[data-opening-days]')).toBeHidden();
  await page.clock.setSystemTime(new Date(midnight+25*3600000));
  await page.clock.runFor(60000);
  await expect(countdown.locator('[data-opening-text]')).toHaveText('Now open');
  await expect(countdown.locator('[data-opening-unit]')).toBeHidden();
});

test('mobile hero fields stack, labels remain readable, and mono words retain spaces',async({page})=>{
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:900});
    await visit(page,'/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`).toBe(true);
    if(width<761){
      const fields=await page.locator('.hero-search>.search-field,.hero-search>button').evaluateAll(els=>els.map(el=>{const rect=el.getBoundingClientRect();return {left:rect.left,top:rect.top,bottom:rect.bottom,width:rect.width}}));
      for(let i=1;i<fields.length;i++){
        expect(fields[i].top).toBeGreaterThanOrEqual(fields[i-1].bottom);
        expect(fields[i].left).toBeCloseTo(fields[0].left,0);
      }
    }
    const labels=await page.locator('.hero-search label').evaluateAll(els=>els.map(el=>parseFloat(getComputedStyle(el).fontSize)));
    expect(labels.every(size=>size>=11)).toBe(true);
    await expect(page.locator('.opening-image-wordmark')).toHaveText('The Foundry Hall / Raleigh, NC');
    await expect(page.getByRole('link',{name:'Openings',exact:true}).first()).toBeAttached();
  }
});
