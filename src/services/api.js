import { supabase, TABLES, LICENSE_STATUS } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { format, addDays, addMonths, addYears } from 'date-fns'

// Auth Services
export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Create or update user profile
    if (data.user) {
      await this.ensureUserProfile(data.user)
    }
    
    return data
  },

  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async ensureUserProfile(user) {
    const { data: existingProfile } = await supabase
      .from(TABLES.USERS_PROFILE)
      .select('*')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      const { error } = await supabase
        .from(TABLES.USERS_PROFILE)
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          role: user.email === 'admin@gateway.com' ? 'admin' : 'user'
        })
      
      if (error) console.error('Error creating user profile:', error)
    }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from(TABLES.USERS_PROFILE)
      .select('*')
      .eq('id', user.id)
      .single()

    return { ...user, profile }
  }
}

// Products Services
export const productsService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(productData) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert(productData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, productData) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update(productData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Licenses Services
export const licensesService = {
  async getAll(filters = {}) {
    let query = supabase
      .from(TABLES.LICENSES)
      .select(`
        *,
        products (name, version),
        users_profile (full_name, company)
      `)
      .order('created_at', { ascending: false })

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(`license_key.ilike.%${filters.search}%,products.name.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.LICENSES)
      .select(`
        *,
        products (*),
        users_profile (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(licenseData) {
    // Generate unique license key
    const licenseKey = this.generateLicenseKey()
    
    const { data, error } = await supabase
      .from(TABLES.LICENSES)
      .insert({
        ...licenseData,
        license_key: licenseKey,
        status: LICENSE_STATUS.PENDING
      })
      .select(`
        *,
        products (name, version),
        users_profile (full_name, company)
      `)
      .single()
    
    if (error) throw error
    
    // Log analytics event
    await this.logAnalyticsEvent('license_created', data.id)
    
    return data
  },

  async update(id, licenseData) {
    const { data, error } = await supabase
      .from(TABLES.LICENSES)
      .update(licenseData)
      .eq('id', id)
      .select(`
        *,
        products (name, version),
        users_profile (full_name, company)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.LICENSES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async activate(licenseKey, hwid) {
    // Get license
    const { data: license, error: licenseError } = await supabase
      .from(TABLES.LICENSES)
      .select('*')
      .eq('license_key', licenseKey)
      .single()

    if (licenseError) throw new Error('License not found')
    
    // Check if license is valid
    if (license.status !== LICENSE_STATUS.ACTIVE) {
      throw new Error('License is not active')
    }

    if (new Date(license.expires_at) < new Date()) {
      throw new Error('License has expired')
    }

    // Check activation limit
    if (license.current_activations >= license.max_activations) {
      throw new Error('Maximum activations reached')
    }

    // Create activation record
    const { data: activation, error: activationError } = await supabase
      .from(TABLES.LICENSE_ACTIVATIONS)
      .insert({
        license_id: license.id,
        hwid,
        ip_address: 'unknown', // Would be populated from request
        user_agent: 'unknown'
      })
      .select()
      .single()

    if (activationError) throw activationError

    // Update license activation count
    await supabase
      .from(TABLES.LICENSES)
      .update({
        current_activations: license.current_activations + 1,
        hwid: hwid // Store the HWID
      })
      .eq('id', license.id)

    return activation
  },

  generateLicenseKey() {
    const segments = []
    for (let i = 0; i < 4; i++) {
      segments.push(Math.random().toString(36).substring(2, 7).toUpperCase())
    }
    return segments.join('-')
  },

  async logAnalyticsEvent(eventType, licenseId, metadata = {}) {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .insert({
        event_type: eventType,
        license_id: licenseId,
        user_id: user?.id,
        metadata
      })
  }
}

// Users Services
export const usersService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.USERS_PROFILE)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.USERS_PROFILE)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS_PROFILE)
      .update(userData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Analytics Services
export const analyticsService = {
  async getDashboardStats() {
    // Get total licenses
    const { count: totalLicenses } = await supabase
      .from(TABLES.LICENSES)
      .select('*', { count: 'exact', head: true })

    // Get active licenses
    const { count: activeLicenses } = await supabase
      .from(TABLES.LICENSES)
      .select('*', { count: 'exact', head: true })
      .eq('status', LICENSE_STATUS.ACTIVE)

    // Get total users
    const { count: totalUsers } = await supabase
      .from(TABLES.USERS_PROFILE)
      .select('*', { count: 'exact', head: true })

    // Get total products
    const { count: totalProducts } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get recent activities
    const { data: recentActivities } = await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select(`
        *,
        licenses (license_key, products (name))
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      totalLicenses: totalLicenses || 0,
      activeLicenses: activeLicenses || 0,
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      recentActivities: recentActivities || []
    }
  },

  async getRevenueStats() {
    // This would calculate revenue based on license sales
    // For now, returning mock data
    return {
      totalRevenue: 24567,
      monthlyGrowth: 15.3
    }
  }
}

// Reports Services
export const reportsService = {
  async generateLicenseReport(filters = {}) {
    const licenses = await licensesService.getAll(filters)
    
    const report = {
      generatedAt: new Date().toISOString(),
      totalLicenses: licenses.length,
      statusBreakdown: {
        active: licenses.filter(l => l.status === LICENSE_STATUS.ACTIVE).length,
        expired: licenses.filter(l => l.status === LICENSE_STATUS.EXPIRED).length,
        pending: licenses.filter(l => l.status === LICENSE_STATUS.PENDING).length,
        suspended: licenses.filter(l => l.status === LICENSE_STATUS.SUSPENDED).length
      },
      licenses: licenses.map(license => ({
        id: license.id,
        licenseKey: license.license_key,
        product: license.products?.name,
        user: license.users_profile?.full_name,
        status: license.status,
        createdAt: license.created_at,
        expiresAt: license.expires_at
      }))
    }

    return report
  },

  async generateUserReport() {
    const users = await usersService.getAll()
    
    return {
      generatedAt: new Date().toISOString(),
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        fullName: user.full_name,
        company: user.company,
        role: user.role,
        createdAt: user.created_at
      }))
    }
  }
}