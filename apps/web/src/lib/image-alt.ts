const descriptions:Record<string,string>={
  '/images/artist-marlowe.webp':'Amber spotlights crossing an empty stage',
  '/images/artist-vexa.webp':'Cool blue beams of light over a dark stage',
  '/images/artist-juniper.webp':'Green light falling across an intimate stage',
  '/images/artist-velvet.webp':'Soft rose and amber lights over a stage',
  '/images/stage-red.webp':'Red spotlights illuminating a dark stage',
  '/images/stage-blue.webp':'Blue spotlights cutting through stage haze',
  '/images/hero-stage.webp':'Amber stage lights cutting through a dark, empty music hall',
  '/images/venue-lincoln.webp':'Warm spotlights above an empty theatre stage',
  '/images/venue-cradle.webp':'Red beams of light over an intimate stage',
  '/images/venue-motorco.webp':'Cool spotlights illuminating a music hall stage',
  '/images/venue-foundry.webp':'Amber lights illuminating an industrial hall stage',
};
export const imageAlt=(image:string)=>descriptions[image]??'';
