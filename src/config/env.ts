import { z } from 'zod';

const EnvSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_USE_MOCKS: z.enum(['true', 'false']).default('false'),
});

const parsed = EnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables — copy .env.example to .env.\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = {
  API_URL: parsed.data.VITE_API_URL,
  USE_MOCKS: parsed.data.VITE_USE_MOCKS === 'true',
} as const;
