import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	PORT: z.string(),
	ACCESS_TOKEN_SECRET: z.string(),
	REFRESH_TOKEN_SECRET: z.string(),
	TOKEN_EXPIRATION: z.string(),
});

export const env = envSchema.parse(process.env);
