import type { APIRoute } from 'astro';
import {events,getVenue} from '../../lib/data';
import {makeIcs} from '../../lib/ics';
export function getStaticPaths(){return events.map(event=>({params:{slug:event.slug},props:{event}}))}
export const GET:APIRoute=({props,site})=>new Response(makeIcs(props.event,getVenue(props.event.venueId),site?.origin),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="${props.event.slug}.ics"`}});
