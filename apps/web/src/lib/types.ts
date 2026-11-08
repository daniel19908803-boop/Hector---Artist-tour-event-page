export interface Artist {
  id: string; slug: string; name: string; genre: string; hometown: string;
  image: string; bio: string; tour: string; tourSlug: string; dates: number;
  color: string; isSample: boolean;
}
export interface Venue {
  id: string; slug: string; name: string; city: string; address: string; neighborhood: string;
  vibe: string; description: string; image: string; capacity: number; lat: number; lng: number;
  accessibility: string; parking: string; isNew?: boolean; openingDate?: string;
  timezone?: string; opening?: {isNewVenue:boolean;openingDate:string}; isSample: boolean;
}
export interface MusicEvent {
  id: string; slug: string; title: string; artistId: string; venueId: string;
  startDateTime: string; endDateTime: string; doorsTime: string; genre: string;
  priceFrom: number; status: 'scheduled' | 'sellingFast' | 'fewLeft' | 'soldOut' | 'cancelled' | 'postponed';
  description: string; eventType: 'concert' | 'tourDate' | 'venueOpening';
  ticketing: 'link' | 'rsvp'; isFree: boolean; featured?: boolean; isSample: boolean;
}
