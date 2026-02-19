import type { Track, TrackSimplified, TrackDurationCategory } from "./schema";

export type { Track, TrackSimplified, TrackDurationCategory };

export interface TrackWithMetadata extends Track {
  durationFormatted: string;
  durationCategory: TrackDurationCategory;
  releaseYear?: number;
}

export interface TracksByDuration {
  category: TrackDurationCategory;
  tracks: Track[];
  count: number;
  averageDuration: number;
}

export interface TrackStats {
  totalTracks: number;
  averageDuration: number;
  averagePopularity: number;
  mostPopular: Track | null;
  leastPopular: Track | null;
}
