export const albumKeys = {
  all: ["albums"] as const,

  lists: () => [...albumKeys.all, "list"] as const,
  list: (query: string, limit?: number, offset?: number) =>
    [...albumKeys.lists(), { query, limit, offset }] as const,

  details: () => [...albumKeys.all, "detail"] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
};
