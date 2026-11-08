import {describe,it,expect} from 'vitest';
import {openingCountdown} from '../apps/web/src/lib/opening';
import {eventBuckets} from '../apps/web/src/lib/dates';

describe('opening countdown in the venue timezone',()=>{
  const opening='2026-11-12T00:00:00Z'; // November 11 at 7 PM in New York.
  it.each([
    ['2026-11-08T20:00:00Z',3,'3 days to go','upcoming'],
    ['2026-11-11T04:59:00Z',1,'1 day to go','upcoming'],
    ['2026-11-11T05:00:00Z',0,'Opens tonight','today'],
    ['2026-11-12T05:00:00Z',-1,'Now open','open'],
  ])('calculates the calendar day at %s',(now,days,label,state)=>{
    expect(openingCountdown(opening,'America/New_York',new Date(now))).toEqual({days,label,state});
  });
  it('counts calendar days across both DST changes, rather than 24-hour periods',()=>{
    expect(openingCountdown('2026-03-09T23:00:00Z','America/New_York',new Date('2026-03-08T04:30:00Z')).label).toBe('2 days to go');
    expect(openingCountdown('2026-11-02T00:00:00Z','America/New_York',new Date('2026-11-01T03:30:00Z')).label).toBe('1 day to go');
  });
  it('accepts a Sanity date-only value without shifting it to the previous day',()=>{
    expect(openingCountdown('2026-11-11','America/New_York',new Date('2026-11-11T05:00:00Z')).label).toBe('Opens tonight');
  });
});

describe('upcoming event buckets in New York',()=>{
  const events=[
    {id:'ended',startDateTime:'2026-11-09T01:00:00Z',endDateTime:'2026-11-09T04:00:00Z'},
    {id:'late-tonight',startDateTime:'2026-11-09T04:30:00Z',endDateTime:'2026-11-09T07:00:00Z'},
    {id:'after-midnight',startDateTime:'2026-11-09T05:01:00Z',endDateTime:'2026-11-09T08:00:00Z'},
    {id:'next-week',startDateTime:'2026-11-16T01:00:00Z',endDateTime:'2026-11-16T04:00:00Z'},
    {id:'next-month',startDateTime:'2026-12-02T01:00:00Z',endDateTime:'2026-12-02T04:00:00Z'},
  ];
  it('includes a late show tonight, excludes ended shows, and puts just after midnight tomorrow',()=>{
    const buckets=eventBuckets(events,new Date('2026-11-09T04:45:00Z'));
    expect(buckets.all.map(e=>e.id)).toEqual(['late-tonight','after-midnight','next-week','next-month']);
    expect(buckets.tonight.map(e=>e.id)).toEqual(['late-tonight']);
    expect(buckets.week.map(e=>e.id)).toEqual(['late-tonight','after-midnight']);
    expect(buckets.month.map(e=>e.id)).toEqual(['late-tonight','after-midnight','next-week']);
  });
  it('moves to the next local day at midnight and removes an event exactly when it ends',()=>{
    const buckets=eventBuckets(events,new Date('2026-11-09T07:00:00Z'));
    expect(buckets.tonight.map(e=>e.id)).toEqual(['after-midnight']);
    expect(buckets.all.some(e=>e.id==='late-tonight')).toBe(false);
  });
  it('treats both repeated 1:30 AM times at the autumn DST boundary as tonight',()=>{
    const repeated=[{startDateTime:'2026-11-01T05:30:00Z',endDateTime:'2026-11-01T08:00:00Z'},{startDateTime:'2026-11-01T06:30:00Z',endDateTime:'2026-11-01T08:00:00Z'}];
    expect(eventBuckets(repeated,new Date('2026-11-01T04:00:00Z')).tonight).toHaveLength(2);
  });
});
