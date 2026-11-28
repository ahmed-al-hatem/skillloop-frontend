import { api } from '@/shared/api/client';
import {
  AuthResponseSchema,
  AuthTokensSchema,
  MeSchema,
  type LoginRequest,
} from '../schemas/auth.schema';

/** `POST /auth/login` */
export async function login(body: LoginRequest) {
  const res = await api.post('/auth/login', body);
  return AuthResponseSchema.parse(res.data);
}

/** `POST /auth/refresh`: returns a NEW refresh token; the one sent is cancelled. */
export async function refreshTokens(refreshToken: string) {
  const res = await api.post('/auth/refresh', { refreshToken });
  return AuthTokensSchema.parse(res.data);
}

/** `POST /auth/logout`: cancels this device's refresh token (204). */
export async function logout(refreshToken: string) {
  await api.post('/auth/logout', { refreshToken });
}

/** `GET /me` */
export async function getMe() {
  const res = await api.get('/me');
  return MeSchema.parse(res.data);
}
