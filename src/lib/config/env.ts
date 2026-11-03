import { z } from 'zod';

/**
 * Validated environment. The only module allowed to read `process.env`. `NEXT_PUBLIC_*` vars
 * must be referenced literally so Next inlines them in the client bundle.
 *
 * The panel talks to the same Supabase project as the PlayMate mobile app, so everything an
 * admin changes is what players see. The key is the publishable (anon) key — admin rights
 * are enforced in the database (`public.admins` + `require_admin()` in every admin RPC).
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3210'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
});

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
});
