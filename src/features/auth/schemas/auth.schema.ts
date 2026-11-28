import { z } from 'zod';

/* Schemas copied from openapi.yaml (components/schemas). */

export const LanguageSchema = z.enum(['ar', 'en']);
export type Language = z.infer<typeof LanguageSchema>;

export const RoleSchema = z.enum(['USER', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

/** `Me`: the logged-in member's own full profile (`GET /me`). */
export const MeSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  photoUrl: z.url().nullable(),
  bio: z.string().max(500).nullable(),
  city: z.string().max(60).nullable(),
  language: LanguageSchema,
  role: RoleSchema,
  emailVerified: z.boolean(),
  needsPhone: z.boolean(),
  hasPassword: z.boolean(),
  pointsAvailable: z.number().int().min(0),
  pointsHeld: z.number().int().min(0),
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
  completedBookingsCount: z.number().int(),
  memberSince: z.iso.datetime(),
});
export type Me = z.infer<typeof MeSchema>;

/** `LoginRequest` body of `POST /auth/login`. */
export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/** `AuthTokens`: access token (15 min) + refresh token (30 days, rotates on every refresh). */
export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  accessTokenExpiresIn: z.number().int(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

/** `AuthResponse` of `POST /auth/login`. */
export const AuthResponseSchema = z.object({
  user: MeSchema,
  tokens: AuthTokensSchema,
  needsPhone: z.boolean(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
