// Public API of the auth feature. Other code imports ONLY from '@/features/auth'.
export { registerAuthInterceptors, type AuthInterceptorOptions } from './api/auth.interceptors';
export { meQueryKey, useCurrentUser, useLogin, useLogout } from './api/auth.queries';
export {
  LoginRequestSchema,
  MeSchema,
  RoleSchema,
  type LoginRequest,
  type Me,
  type Role,
} from './schemas/auth.schema';
export { authRoutes } from './routes';
