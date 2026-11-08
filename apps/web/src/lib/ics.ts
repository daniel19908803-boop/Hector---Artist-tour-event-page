import { formatInTimeZone } from 'date-fns-tz';
import type { MusicEvent, Venue } from './types';
const escape = (value: string) => value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
export function makeIcs(event: MusicEvent, venue: Venue, origin='https://livediscover.com') {
  const format=(d: string)=>formatInTimeZone(d,'UTC',"yyyyMMdd'T'HHmmss'Z'");
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LiveDiscover//Live music//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:${event.id}@livediscover.com`,`DTSTAMP:${format(new Date().toISOString())}`,`DTSTART:${format(event.startDateTime)}`,`DTEND:${format(event.endDateTime)}`,`SUMMARY:${escape(event.title)}`,`LOCATION:${escape(venue.name+', '+venue.address)}`,`DESCRIPTION:${escape(event.description)}`,`URL:${origin}/events/${event.slug}`,'END:VEVENT','END:VCALENDAR'];
  return lines.map(line=>{let out='',length=0;for(const ch of line){const bytes=new TextEncoder().encode(ch).length;if(length+bytes>75){out+='\r\n ';length=1;}out+=ch;length+=bytes;}return out;}).join('\r\n')+'\r\n';
}
