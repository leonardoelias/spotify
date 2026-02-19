export { useSearchArtists } from "./api/useSearchArtists";
export { useSearchAlbums } from "./api/useSearchAlbums";
export { useArtistDetails } from "./api/useArtistDetails";
export { useArtistTopTracks } from "./api/useArtistTopTracks";
export { useArtistAlbums } from "./api/useArtistAlbums";

export {
  artistSearchOptions,
  albumSearchOptions,
  artistDetailOptions,
  artistTopTracksOptions,
  artistAlbumsOptions,
} from "./api/queries";
export type { AlbumSearchFilters } from "./api/queries";
export { artistKeys } from "./api/keys";

export { ArtistCard } from "./components/ArtistCard";
export { ArtistDetails } from "./components/ArtistDetails";
export { ArtistCharts } from "./components/ArtistCharts";
export { SearchTypeToggle } from "./components/SearchTypeToggle";

export { SearchBar } from "@/shared/components";
export { AlbumCard } from "@/features/albums";
export { TrackList } from "@/features/tracks";
