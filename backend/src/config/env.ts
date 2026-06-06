import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(5000),

  FRONTEND_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  SERVER_HMAC_SECRET: z.string().min(32),

  WEBHOOK_SECRET: z.string().min(1),

  SOLANA_RPC_URL: z.string().url(),

  WEBHOOK_BASE_URL: z.string().url(),
  CHECKOUT_BASE_URL: z.string().url(),
 CHECKOUT_SESSION_SECRET: z.string(),

  PROGRAM_ID: z.string().min(1),

  BACKEND_PRIVATE_KEY: z.string().min(1),

  ADMIN_KEYPAIR: z.string().min(1),
  MINT_ADDRESS: z.string().min(1),
  ADMIN_FEE_VAULT: z.string().min(1),
 ADMIN_PUBLICKEY:z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;