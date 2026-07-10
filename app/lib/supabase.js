import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fbcxefvvifmxaiqxiuq.supabase.co'
const supabaseAnonKey = 'sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
