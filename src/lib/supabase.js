import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export const TABLES = {
  PRODUCTS: 'products',
  USERS_PROFILE: 'users_profile',
  LICENSES: 'licenses',
  LICENSE_ACTIVATIONS: 'license_activations',
  ANALYTICS_EVENTS: 'analytics_events'
}

export const LICENSE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}