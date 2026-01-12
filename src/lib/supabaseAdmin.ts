import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let supabaseAdminInstance: SupabaseClient<Database> | null = null;

function createSupabaseAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createSupabaseAdminClient();
  }
  return supabaseAdminInstance;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getSupabaseAdminClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
