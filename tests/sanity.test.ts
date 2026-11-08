import {afterEach,expect,it,vi} from 'vitest';

afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();vi.resetModules()});

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
