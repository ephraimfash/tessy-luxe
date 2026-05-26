import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://rexntutqfjubyegspskd.supabase.co
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleG50dXRxZmp1YnllZ3Nwc2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDg5NDMsImV4cCI6MjA5NTI4NDk0M30.QNz7AJVVFI4FDnBcw17NEUFhzSbjymIbPX4PtORVGaE
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)