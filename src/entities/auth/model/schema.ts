import { z } from "zod";

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().nullable(),
  email: z.string().email().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        height: z.number().nullable(),
        width: z.number().nullable(),
      }),
    )
    .optional(),
  external_urls: z.object({
    spotify: z.string().url(),
  }),
  followers: z
    .object({
      total: z.number(),
    })
    .optional(),
  country: z.string().optional(),
  product: z.string().optional(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

export interface AuthState {
  user: UserProfile | null;
}
