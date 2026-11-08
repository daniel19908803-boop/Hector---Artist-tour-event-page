import { formatInTimeZone } from 'date-fns-tz';
const timezone = 'America/New_York';
export function isUpcoming(event: {startDateTime: string; endDateTime?: string}, now = new Date()) {
  return new Date(event.endDateTime ?? new Date(new Date(event.startDateTime).getTime()+14400000)) > now;
}
export function matchesWhen(date: string, when: string, now=new Date()) {
  const local = (d: Date|string) => formatInTimeZone(d,timezone,'yyyy-MM-dd');
  const current=local(now), candidate=local(date);
  if(when==='tonight')return current===candidate;
  const days=(Date.parse(`${candidate}T12:00:00Z`)-Date.parse(`${current}T12:00:00Z`))/86400000;
  if(when==='week')return days>=0&&days<7;
  if(when==='weekend') { const wd=new Date(`${candidate}T12:00:00Z`).getUTCDay(); return days>=0&&days<7&&(wd===5||wd===6||wd===0); }
  if(when==='month')return candidate.slice(0,7)===current.slice(0,7)&&days>=0;
  return true;
}
