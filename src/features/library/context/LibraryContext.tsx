import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { loadLibrary, saveLibrary } from "../model/storage";

import type { Album } from "@/entities/album";
import type { Artist } from "@/entities/artist";
import type { Library } from "@/entities/favorites";

type LibraryAction =
  | { type: "ADD_ARTIST"; artist: Artist }
  | { type: "REMOVE_ARTIST"; artistId: string }
  | { type: "ADD_ALBUM"; album: Album }
  | { type: "REMOVE_ALBUM"; albumId: string }
  | { type: "LOAD_LIBRARY"; library: Library }
  | { type: "CLEAR_LIBRARY" };

interface LibraryContextValue {
  library: Library;
  addArtist: (artist: Artist) => void;
  removeArtist: (artistId: string) => void;
  isArtistFavorite: (artistId: string) => boolean;
  addAlbum: (album: Album) => void;
  removeAlbum: (albumId: string) => void;
  isAlbumFavorite: (albumId: string) => boolean;
  clearLibrary: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

function libraryReducer(state: Library, action: LibraryAction): Library {
  switch (action.type) {
    case "ADD_ARTIST": {
      if (state.artists.some((fav) => fav.item.id === action.artist.id)) {
        return state;
      }
      return {
        ...state,
        artists: [
          ...state.artists,
          {
            type: "artist",
            item: action.artist,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    }

    case "REMOVE_ARTIST": {
      return {
        ...state,
        artists: state.artists.filter((fav) => fav.item.id !== action.artistId),
      };
    }

    case "ADD_ALBUM": {
      if (state.albums.some((fav) => fav.item.id === action.album.id)) {
        return state;
      }
      return {
        ...state,
        albums: [
          ...state.albums,
          {
            type: "album",
            item: action.album,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    }

    case "REMOVE_ALBUM": {
      return {
        ...state,
        albums: state.albums.filter((fav) => fav.item.id !== action.albumId),
      };
    }

    case "LOAD_LIBRARY": {
      return action.library;
    }

    case "CLEAR_LIBRARY": {
      return { artists: [], albums: [] };
    }

    default:
      return state;
  }
}

interface LibraryProviderProps {
  children: ReactNode;
}

export function LibraryProvider({ children }: LibraryProviderProps) {
  const [library, dispatch] = useReducer(libraryReducer, null, () => {
    return loadLibrary();
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      saveLibrary(library);
    }
  }, [library]);

  const addArtist = useCallback((artist: Artist) => {
    dispatch({ type: "ADD_ARTIST", artist });
  }, []);

  const removeArtist = useCallback((artistId: string) => {
    dispatch({ type: "REMOVE_ARTIST", artistId });
  }, []);

  const addAlbum = useCallback((album: Album) => {
    dispatch({ type: "ADD_ALBUM", album });
  }, []);

  const removeAlbum = useCallback((albumId: string) => {
    dispatch({ type: "REMOVE_ALBUM", albumId });
  }, []);

  const clearLibrary = useCallback(() => {
    dispatch({ type: "CLEAR_LIBRARY" });
  }, []);

  const isArtistFavorite = useCallback(
    (artistId: string) => {
      return library.artists.some((fav) => fav.item.id === artistId);
    },
    [library.artists],
  );

  const isAlbumFavorite = useCallback(
    (albumId: string) => {
      return library.albums.some((fav) => fav.item.id === albumId);
    },
    [library.albums],
  );

  const value: LibraryContextValue = useMemo(
    () => ({
      library,
      addArtist,
      removeArtist,
      isArtistFavorite,
      addAlbum,
      removeAlbum,
      isAlbumFavorite,
      clearLibrary,
    }),
    [
      library,
      addArtist,
      removeArtist,
      isArtistFavorite,
      addAlbum,
      removeAlbum,
      isAlbumFavorite,
      clearLibrary,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }
  return context;
}
