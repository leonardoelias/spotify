import { setupServer } from "msw/node";

import { apiHandlers } from "./mocks/handlers";

export { apiHandlers };
export const server = setupServer(...apiHandlers);
