import { rootRoute } from "../routes/__root";
import { authenticatedRoute } from "../routes/_authenticated";
import { artistDetailRoute } from "../routes/_authenticated/artists/$artistId";
import { artistsIndexRoute } from "../routes/_authenticated/artists/index";
import { libraryRoute } from "../routes/_authenticated/library";
import { callbackRoute } from "../routes/callback";
import { indexRoute } from "../routes/index";

const authenticatedRouteWithChildren = authenticatedRoute.addChildren([
  artistsIndexRoute,
  artistDetailRoute,
  libraryRoute,
]);

const rootRouteWithChildren = rootRoute.addChildren([
  indexRoute,
  callbackRoute,
  authenticatedRouteWithChildren,
]);

export const routeTree = rootRouteWithChildren;
