import { addHours } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import type { Artist, Venue, MusicEvent } from './types';
import { eventBuckets } from './dates';

export const timezone = 'America/New_York';
export const cities = ['Raleigh', 'Durham', 'Chapel Hill', 'Carrboro', 'Cary'];
export const genres = ['Indie rock', 'Electronic', 'Folk & Americana', 'Soul & R&B', 'Heavy metal', 'Pop', 'Hip-hop', 'Jazz'];
export const artists: Artist[] = [
  { id: 'marlowe', slug: 'marlowe-and-the-static', name: 'Marlowe & the Static', genre: 'Indie rock', hometown: 'Asheville, NC', image: '/images/artist-marlowe.webp', tour: 'After the Afterglow Tour', tourSlug: 'after-the-afterglow', dates: 24, color: '#ba7640', bio: 'Guitars that glow like the last light on a mountain road. Marlowe & the Static turn small-town stories into widescreen indie rock, equal parts restless energy and slow-burning warmth. Their new live set follows the thread of After the Afterglow: finding a little light in the places you least expect.', isSample: true },
  { id: 'vexa', slug: 'vexa', name: 'VEXA', genre: 'Electronic', hometown: 'Brooklyn, NY', image: '/images/artist-vexa.webp', tour: 'Between Frequencies', tourSlug: 'between-frequencies', dates: 31, color: '#7e9190', bio: 'A late-night transmission from somewhere between the dance floor and a daydream. VEXA builds immersive live electronic sets from analog synths, fractured vocals, and bass you can feel in your ribs. Between Frequencies is a room-filling journey, designed to be experienced together.', isSample: true },
  { id: 'juniper', slug: 'saint-juniper', name: 'Saint Juniper', genre: 'Folk & Americana', hometown: 'Carrboro, NC', image: '/images/artist-juniper.webp', tour: 'The Long Way Home', tourSlug: 'the-long-way-home', dates: 18, color: '#747947', bio: 'Songs that feel like letters from an old friend. Saint Juniper pairs fingerpicked guitar with close harmonies and the kind of storytelling that makes a crowded room fall quiet. The Long Way Home brings new songs, familiar favorites, and a few stories from the road.', isSample: true },
  { id: 'velvet', slug: 'the-velvet-hours', name: 'The Velvet Hours', genre: 'Soul & R&B', hometown: 'Durham, NC', image: '/images/artist-velvet.webp', tour: 'In Good Time', tourSlug: 'in-good-time', dates: 22, color: '#967a76', bio: 'Deep grooves. Patient melodies. Nothing rushed. The Velvet Hours bring the warmth of classic soul into the present, with a live rhythm section that knows exactly when to leave space. In Good Time is their invitation to put the phone away and stay a little longer.', isSample: true },
  { id: 'pines', slug: 'iron-pines', name: 'Iron Pines', genre: 'Heavy metal', hometown: 'Richmond, VA', image: '/images/stage-red.webp', tour: 'Weight of the Woods', tourSlug: 'weight-of-the-woods', dates: 16, color: '#9c4236', bio: 'Heavy riffs with roots that run deep. Iron Pines channel Appalachian atmosphere into a thunderous live show, moving from spacious passages to walls of sound. Bring ear protection and make room at the front.', isSample: true },
  { id: 'cassidy', slug: 'cassidy-rowe', name: 'Cassidy Rowe', genre: 'Pop', hometown: 'Nashville, TN', image: '/images/stage-blue.webp', tour: 'Everything in Color', tourSlug: 'everything-in-color', dates: 28, color: '#768f9b', bio: 'Big-hearted pop for the drive home with the windows down. Cassidy Rowe writes candid songs about growing up, moving on, and starting over. Everything in Color brings those stories to life with a full band and a chorus for everyone in the room.', isSample: true },
];
export const venues: Venue[] = [
  { id: 'lincoln', slug: 'lincoln-theatre', name: 'Lincoln Theatre', city: 'Raleigh', address: '126 E Cabarrus St, Raleigh, NC', neighborhood: 'Downtown', vibe: 'Historic theatre. Electric nights.', description: 'An intimate downtown room where a great night can start with a new discovery. Our sample program imagines guitar bands, soulful late sets, and artists on the way up.', image: '/images/venue-lincoln.webp', capacity: 750, lat: 35.7756, lng: -78.6370, accessibility: 'Contact the venue directly to confirm accessible entry, viewing areas, and companion seating.', parking: 'Check nearby downtown garages and current parking restrictions before you travel.', isSample: true },
  { id: 'cradle', slug: 'cats-cradle', name: "Cat’s Cradle", city: 'Carrboro', address: '300 E Main St, Carrboro, NC', neighborhood: 'Downtown Carrboro', vibe: 'Small room. Legendary energy.', description: 'A room for getting close to the music. This sample lineup pairs intimate songwriting nights with expansive indie rock and plenty of discoveries in between.', image: '/images/venue-cradle.webp', capacity: 750, lat: 35.9103, lng: -79.0711, accessibility: 'Please confirm specific accessibility arrangements directly with the venue before booking.', parking: 'Explore public parking in downtown Carrboro and check posted restrictions.', isSample: true },
  { id: 'motorco', slug: 'motorco-music-hall', name: 'Motorco Music Hall', city: 'Durham', address: '723 Rigsbee Ave, Durham, NC', neighborhood: 'Central Park', vibe: 'Good sound. Better company.', description: 'Make a night of it in Durham. Our demo calendar brings together adventurous electronic sets, local soul, and bands worth catching before everyone else does.', image: '/images/venue-motorco.webp', capacity: 450, lat: 36.0038, lng: -78.9000, accessibility: 'Ask the venue about step-free access, accessible restrooms, and viewing arrangements.', parking: 'Allow time to find parking around the Central Park district.', isSample: true },
  { id: 'ritz', slug: 'the-ritz', name: 'The Ritz', city: 'Raleigh', address: '2820 Industrial Dr, Raleigh, NC', neighborhood: 'Midtown', vibe: 'Big sound. All-in crowds.', description: 'A bigger room for a bigger night. Discover our imagined mix of touring pop, heavier guitars, and electronic live sets.', image: '/images/stage-blue.webp', capacity: 1400, lat: 35.8178, lng: -78.6203, accessibility: 'Contact the venue for current accessibility information and seating options.', parking: 'Review the venue’s current travel and parking guidance before arrival.', isSample: true },
  { id: 'arena', slug: 'raleigh-arena', name: 'Raleigh Arena', city: 'Raleigh', address: '1400 Edwards Mill Rd, Raleigh, NC', neighborhood: 'West Raleigh', vibe: 'The whole city, singing along.', description: 'A sample arena listing for the tour moments that call for a little more scale. Confirm the venue’s current name and details before publishing real events.', image: '/images/hero-stage.webp', capacity: 19000, lat: 35.8033, lng: -78.7218, accessibility: 'Confirm accessible parking, entry, and seating with the venue.', parking: 'Plan your route and review event-specific parking information.', isSample: true },
  { id: 'dpac', slug: 'dpac', name: 'DPAC', city: 'Durham', address: '123 Vivian St, Durham, NC', neighborhood: 'American Tobacco District', vibe: 'A seat for something special.', description: 'An evening built around the performance. Our demo selection imagines acoustic storytellers and rich, full-band soul in a seated theatre setting.', image: '/images/venue-lincoln.webp', capacity: 2700, lat: 35.9930, lng: -78.9022, accessibility: 'Check with the venue for accessible seats, assisted listening, and other accommodations.', parking: 'Check downtown Durham garage availability and event pricing.', isSample: true },
  { id: 'foundry', slug: 'the-foundry-hall', name: 'The Foundry Hall', city: 'Raleigh', address: 'Warehouse District, Raleigh, NC', neighborhood: 'Warehouse District', vibe: 'A new home for after hours.', description: 'Old brick. New noise. A former industrial space reimagined as a home for live music, with a close-to-the-stage floor, a listening lounge, and room for the unexpected. Join us for a first look, a local lineup, and the first of many late nights.', image: '/images/venue-foundry.webp', capacity: 400, lat: 35.7765, lng: -78.6450, accessibility: 'Our fictional venue is designed with step-free entry and an accessible viewing area.', parking: 'The fictional venue is in the Warehouse District. A precise address will be added before a real opening.', isNew: true, isSample: true },
];
const now = new Date();
const today = formatInTimeZone(now, timezone, 'yyyy-MM-dd');
const [todayYear,todayMonth]=today.split('-').map(Number);
const nextMonth = new Date(Date.UTC(todayYear,todayMonth,1,12));
const firstSaturday = (6 - nextMonth.getUTCDay() + 7) % 7;
const openingLocal = new Date(Date.UTC(todayYear,todayMonth,firstSaturday+8,12));
let sampleDocumentsExist = false;
// Read the published venue opening when a Sanity project is connected.
const project = process.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env?.PUBLIC_SANITY_PROJECT_ID;
if(project){
  const dataset=process.env.PUBLIC_SANITY_DATASET || import.meta.env?.PUBLIC_SANITY_DATASET || 'production';
  const token=process.env.SANITY_API_READ_TOKEN || import.meta.env?.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  const query='{ "venues": *[_type == "venue" && defined(opening.openingDate)]{ "slug": slug.current, timezone, opening }, "hasSamples": count(*[isSample == true]) > 0 }';
  const response=await fetch(`https://${project}.api.sanity.io/v2025-01-01/data/query/${encodeURIComponent(dataset)}?query=${encodeURIComponent(query)}`,{headers:token?{Authorization:`Bearer ${token}`}:{}});
  if(!response.ok)throw new Error(`Could not read Sanity venue openings (${response.status}).`);
  const {result}=await response.json() as {result:{venues:{slug:string;timezone?:string;opening:{isNewVenue:boolean;openingDate:string}}[];hasSamples:boolean}};
  sampleDocumentsExist=result.hasSamples;
  for(const document of result.venues){const venue=venues.find(v=>v.slug===document.slug);if(venue){venue.opening=document.opening;venue.timezone=document.timezone||timezone;venue.isNew=document.opening.isNewVenue;venue.openingDate=document.opening.openingDate;}}
}
const foundry=venues.find(v => v.id === 'foundry')!;
foundry.opening ??= {isNewVenue:true,openingDate:fromZonedTime(`${openingLocal.toISOString().slice(0,10)}T19:00:00`,timezone).toISOString()};
foundry.timezone ??= timezone;
export const openingDate = foundry.opening.openingDate;
foundry.openingDate = openingDate;
const descriptions = [
  'A night for finding your new favorite song. Arrive early, catch the opening set, and settle in for a performance that stays with you long after the last note.',
  'One room, a live band, and nowhere else you need to be. This stop on the tour brings new material and familiar favorites together for an evening made for being there.',
  'Leave a little room in your week for something unexpected. Join fellow music lovers for a close-up live set, a few surprises, and a proper night out in the Triangle.',
];
const schedule: [string, string, number, number, MusicEvent['status']][] = [
  ['marlowe','lincoln',0,28,'sellingFast'], ['vexa','motorco',2,32,'fewLeft'],
  ['juniper','cradle',4,22,'scheduled'], ['velvet','lincoln',5,25,'sellingFast'],
  ['pines','ritz',8,35,'scheduled'], ['cassidy','dpac',11,48,'scheduled'],
  ['marlowe','motorco',14,26,'scheduled'], ['vexa','ritz',18,42,'soldOut'],
  ['juniper','lincoln',21,20,'scheduled'], ['velvet','cradle',24,0,'scheduled'],
  ['cassidy','arena',29,65,'sellingFast'], ['pines','motorco',34,30,'cancelled'],
  ['marlowe','cradle',41,25,'scheduled'], ['vexa','lincoln',48,35,'scheduled'],
  ['velvet','dpac',56,45,'scheduled'], ['juniper','cradle',-7,20,'scheduled'],
  ['vexa','motorco',-14,30,'scheduled'], ['marlowe','lincoln',-21,25,'scheduled'],
];
export const events: MusicEvent[] = schedule.map(([artistId,venueId,day,priceFrom,status], i) => {
  const artist = artists.find(a => a.id === artistId)!;
  const venue = venues.find(v => v.id === venueId)!;
  const calendarDay = new Date(Date.UTC(todayYear,todayMonth-1,Number(today.slice(-2))+day,12)).toISOString().slice(0,10);
  const start = fromZonedTime(`${calendarDay}T20:00:00`,timezone);
  return { id: `event-${i+1}`, slug: `${artist.slug}-${venue.slug}-${formatInTimeZone(start,timezone,'yyyy-MM-dd')}`, title: artist.name, artistId, venueId, startDateTime: start.toISOString(), endDateTime: addHours(start,3).toISOString(), doorsTime: addHours(start,-1).toISOString(), genre: artist.genre, priceFrom, status, description: descriptions[i%3], eventType: 'tourDate', ticketing: 'link', isFree: priceFrom === 0, featured: i===0, isSample:true };
});
events.push({id:'event-opening', slug:'the-foundry-hall-opening-night',title:'The first of many nights', artistId:'velvet',venueId:'foundry',startDateTime:openingDate,endDateTime:addHours(new Date(openingDate),4).toISOString(),doorsTime:openingDate,genre:'Soul & R&B',priceFrom:0,status:'scheduled',description:'Step inside The Foundry Hall for the very first time. The Velvet Hours and special local guests christen the stage with a night of warm soul, adventurous sounds, and a toast to a new gathering place. Entry is free with an RSVP. This opening is a fictional demonstration.',eventType:'venueOpening',ticketing:'rsvp',isFree:true,isSample:true});
export const getArtist = (id: string) => artists.find(a=>a.id===id)!;
export const getVenue = (id: string) => venues.find(v=>v.id===id)!;
export const upcomingEvents = eventBuckets(events,now).all;
export const artistEvents = (id: string) => upcomingEvents.filter(e=>e.artistId===id);
export const venueEvents = (id: string) => upcomingEvents.filter(e=>e.venueId===id);
export const displayDate = (date: string, pattern='MMM d') => formatInTimeZone(date,timezone,pattern);
export const eventIndex = upcomingEvents.map(e=>({...e,artist:getArtist(e.artistId),venue:getVenue(e.venueId)}));
export const hasSampleContent = sampleDocumentsExist || [...artists,...venues,...events].some(document=>document.isSample);
