import {afterEach,expect,it,vi} from 'vitest';

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();vi.unstubAllGlobals();vi.resetModules()});

it('runs entirely on local sample data without Sanity variables, requests or warnings',async()=>{
  for(const name of ['PUBLIC_SANITY_PROJECT_ID','PUBLIC_SANITY_DATASET','SANITY_API_READ_TOKEN','SANITY_API_WRITE_TOKEN'])vi.stubEnv(name,undefined);
  const fetch=vi.fn().mockRejectedValue(new Error('Local sample data must not request Sanity'));
  vi.stubGlobal('fetch',fetch);
  const warn=vi.spyOn(console,'warn');
  const error=vi.spyOn(console,'error');
  const {artists,venues,events,openingDate,hasSampleContent}=await import('../apps/web/src/lib/data');
  const {imageAlt}=await import('../apps/web/src/lib/image-alt');
  expect(artists.length).toBeGreaterThan(0);
  expect(venues.find(venue=>venue.id==='foundry')!.opening!.openingDate).toBe(openingDate);
  expect(events.find(event=>event.id==='event-opening')!.startDateTime).toBe(openingDate);
  expect(hasSampleContent).toBe(true);
  for(const document of [...artists,...venues]){
    expect(imageAlt(document.image).length).toBeGreaterThan(0);
    expect(imageAlt(document.image)).not.toMatch(/original|artwork|sample|fictional|listing/i);
  }
  expect(fetch).not.toHaveBeenCalled();
  expect(warn).not.toHaveBeenCalled();
  expect(error).not.toHaveBeenCalled();
});

it('uses venue.opening.openingDate and timezone from Sanity for every opening surface',async()=>{
  vi.stubEnv('PUBLIC_SANITY_PROJECT_ID','testproject');
  vi.stubEnv('PUBLIC_SANITY_DATASET','production');
  const opening={isNewVenue:true,openingDate:'2030-06-08T23:00:00Z'};
  const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({result:{venues:[{slug:'the-foundry-hall',timezone:'America/New_York',opening}],hasSamples:true}})});
  vi.stubGlobal('fetch',fetch);
  const {venues,openingDate,events,hasSampleContent}=await import('../apps/web/src/lib/data');
  expect(venues.find(venue=>venue.id==='foundry')).toMatchObject({opening,timezone:'America/New_York'});
  expect(openingDate).toBe(opening.openingDate);
  expect(events.find(event=>event.id==='event-opening')!.startDateTime).toBe(opening.openingDate);
  expect(hasSampleContent).toBe(true);
  const query=new URL(fetch.mock.calls[0][0]).searchParams.get('query');
  expect(query).toContain('defined(opening.openingDate)');
  expect(query).toContain('count(*[isSample == true])');
});
