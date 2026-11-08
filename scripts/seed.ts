import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {artists,venues,events,genres,cities} from '../apps/web/src/lib/data';
const project=process.env.PUBLIC_SANITY_PROJECT_ID,dataset=process.env.PUBLIC_SANITY_DATASET||'production',token=process.env.SANITY_API_WRITE_TOKEN;
const api=`https://${project}.api.sanity.io/v2025-01-01/data`;
const jsonHeaders={'Content-Type':'application/json',Authorization:`Bearer ${token}`};
const slug=(text:string)=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const ref=(_ref:string)=>({_type:'reference',_ref});
const rich=(text:string)=>[{_type:'block',_key:'copy',style:'normal',markDefs:[],children:[{_type:'span',_key:'text',text,marks:[]}]}];
if(process.argv.includes('--clean')){
 if(!project||!token)throw new Error('Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN to clean sample documents.');
 const response=await fetch(`${api}/mutate/${dataset}`,{method:'POST',headers:jsonHeaders,body:JSON.stringify({mutations:[{delete:{query:'isSample == true'}}]})});
 if(!response.ok)throw new Error(`Sanity rejected cleanup (${response.status})`);console.log('Removed documents marked isSample. Shared image assets were retained.');
}else{
 if(!existsSync('apps/web/public/images/hero-stage.webp'))execFileSync(process.execPath,['scripts/generate-art.mjs'],{stdio:'inherit'});
 await mkdir('docs',{recursive:true});
 await writeFile('docs/sample-content.json',JSON.stringify({generatedAt:new Date().toISOString(),artists,venues,events,genres,cities},null,2));
 if(!project||!token){console.log('Original demo content is already inserted into the website. Wrote docs/sample-content.json. Set Sanity environment variables to also seed your CMS.');process.exit(0)}
 const imageCache=new Map<string,unknown>();
 async function image(url:string,alt:string){if(imageCache.has(url))return imageCache.get(url);const file=await readFile(`apps/web/public${url}`);const response=await fetch(`https://${project}.api.sanity.io/v2025-01-01/assets/images/${dataset}?filename=${encodeURIComponent(url.split('/').pop()!)}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'image/webp'},body:file});if(!response.ok)throw new Error(`Image upload failed: ${response.status}`);const result=await response.json() as {document:{_id:string}};const img={_type:'image',asset:ref(result.document._id),alt};imageCache.set(url,img);return img}
 const docs:Record<string,unknown>[]=[];
 for(const [order,name] of genres.entries())docs.push({_id:`sample-genre-${slug(name)}`,_type:'genre',name,slug:{_type:'slug',current:slug(name)},order,isSample:true});
 for(const name of cities)docs.push({_id:`sample-city-${slug(name)}`,_type:'city',name,slug:{_type:'slug',current:slug(name)},state:'NC',isFeatured:true,isSample:true});
 for(const artist of artists){docs.push({_id:`sample-artist-${artist.id}`,_type:'artist',name:artist.name,slug:{_type:'slug',current:artist.slug},genres:[{...ref(`sample-genre-${slug(artist.genre)}`),_key:'genre'}],bio:rich(artist.bio),hometown:artist.hometown,image:await image(artist.image,`Original stage-light artwork for fictional artist ${artist.name}`),isSample:true});docs.push({_id:`sample-tour-${artist.id}`,_type:'tour',name:artist.tour,slug:{_type:'slug',current:artist.tourSlug},artist:ref(`sample-artist-${artist.id}`),description:rich(artist.bio),isSample:true})}
 for(const venue of venues)docs.push({_id:`sample-venue-${venue.id}`,_type:'venue',name:venue.name,slug:{_type:'slug',current:venue.slug},address:{street:venue.address,city:venue.city,state:'NC',country:'US'},geo:{_type:'geopoint',lat:venue.lat,lng:venue.lng},neighborhood:venue.neighborhood,capacity:venue.capacity,vibe:venue.vibe,description:rich(venue.description),image:await image(venue.image,`Original artwork for the sample ${venue.name} listing`),accessibilityInfo:venue.accessibility,parkingInfo:venue.parking,timezone:'America/New_York',opening:venue.isNew?{isNewVenue:true,openingDate:venue.openingDate,openingEvent:ref('sample-event-opening')}:undefined,isSample:true});
 for(const event of events){const artist=artists.find(a=>a.id===event.artistId)!;docs.push({_id:`sample-${event.id}`,_type:'event',title:event.title,slug:{_type:'slug',current:event.slug},eventType:event.eventType,artists:[{...ref(`sample-artist-${event.artistId}`),_key:'headliner'}],tour:event.eventType==='tourDate'?ref(`sample-tour-${event.artistId}`):undefined,venue:ref(`sample-venue-${event.venueId}`),startDateTime:event.startDateTime,endDateTime:event.endDateTime,doorsTime:event.doorsTime,timezone:'America/New_York',status:event.status,priceFrom:event.priceFrom,currency:'USD',isFree:event.isFree,ticketing:{mode:event.ticketing,provider:'other',ctaLabel:event.ticketing==='rsvp'?'RSVP':'Tickets'},rsvp:event.ticketing==='rsvp'?{enabled:true,capacity:400,closesAt:event.startDateTime}:undefined,genres:[{...ref(`sample-genre-${slug(event.genre)}`),_key:'genre'}],ageRestriction:'allAges',heroImage:await image(artist.image,`Sample show artwork for ${event.title}`),description:rich(event.description),featured:!!event.featured,isSample:true})}
 docs.push({_id:'siteSettings',_type:'siteSettings',siteName:'LiveDiscover',tagline:'Where the night begins.',newsletterCopy:'The shows worth knowing about, every Thursday.',accentColor:'#E9B451',homepageFeaturedEvent:ref('sample-event-1'),isSample:true});
 const response=await fetch(`${api}/mutate/${dataset}`,{method:'POST',headers:jsonHeaders,body:JSON.stringify({mutations:docs.map(doc=>doc._id==='siteSettings'?{createIfNotExists:doc}:{createOrReplace:doc})})});if(!response.ok)throw new Error(`Seeding failed: ${response.status} ${await response.text()}`);console.log(`Inserted ${docs.length} original sample documents into Sanity. Fixed IDs make repeated runs safe.`);
}
