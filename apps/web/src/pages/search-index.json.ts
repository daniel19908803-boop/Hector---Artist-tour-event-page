import type { APIRoute } from 'astro';
import {eventIndex} from '../lib/data';
export const GET:APIRoute=()=>new Response(JSON.stringify(eventIndex),{headers:{'Content-Type':'application/json; charset=utf-8'}});
