export const SEARCH_DEFAULTS = {
  q: "",
  type: "artists" as const,
  page: 1,
} as const;

export type SearchParams = typeof SEARCH_DEFAULTS;

export const buildSearchUrl = (overrides: Partial<SearchParams> = {}) => ({
  ...SEARCH_DEFAULTS,
  ...overrides,
});
