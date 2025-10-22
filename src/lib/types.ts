// src/lib/types.ts

// ---- Track shape used in responses/results ----
export type Track = {
  id?: number;                 
  album_id?: number | null;    
  albumId?: number | null;     
  number?: number;             
  title: string;
  lyrics?: string | null;
  video?: string | null;
};

// ---- Album shape used in responses/results ----
export type Album = {
  id: number;
  slug?: string;
  title: string;
  artist: string;
  year?: number | null | undefined;
  image?: any;              
  description: string;
  tracks: Track[];          
};

// ---- reference DB row names elsewhere, you can alias: ----
export type AlbumRow = Album;
export type TrackRow = Track;

// ---- App Router dynamic-route params ----
export type SlugParams = { params: { slug: string } };
export type SearchParams = { params: { searchTerm: string } };
