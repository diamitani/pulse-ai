import { createClient } from '@supabase/supabase-js'

// Use for server-side cron/admin operations (no cookie context)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
