import { createContext, useContext } from "react";

import type { Artist } from "@/entities/artist";

interface ArtistCardContextValue {
  artist: Artist;
}

const ArtistCardContext = createContext<ArtistCardContextValue | null>(null);

export function useArtistCardContext() {
  const context = useContext(ArtistCardContext);

  if (!context) {
    throw new Error("useArtistCardContext must be used within ArtistCard");
  }

  return context;
}

export { ArtistCardContext };
