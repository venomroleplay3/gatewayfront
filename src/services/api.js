import { supabase, TABLES, LICENSE_STATUS } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { format, addDays, addMonths, addYears } from 'date-fns'

// Auth Services
export const authService = {
  async signIn(email, password) {
    try {
      // For demo purposes, allow any password for admin@gateway.com
      if (email === 'admin@gateway.com') {
        // Create a mock session for demo
        const mockUser = {
          id: '00000000-0000-0000-0000-000000000000',
          email: 'admin@gateway.com',
          user_metadata: {
            full_name: 'Admin User'
          }
        }
        
        // Ensure user profile exists
        await this.ensureUserProfile(mockUser)
        
        return {
          user: mockUser,
          session: { access_token: 'demo-token' }
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // If user doesn't exist, create them
        if (error.message.includes('Invalid login credentials')) {
          const signUpResult = await this.signUp(email, password, {
            full_name: email.split('@')[0]
          })
          if (signUpResult.user) {
            return await this.signIn(email, password)
          }
        }
        throw error
      }
      
      // Create or update user profile
      if (data.user) {
        await this.ensureUserProfile(data.user)
      }
      
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin
        }
      })
      
      if (error) throw error
      
      // Create user profile immediately
      if (data.user) {
        await this.ensureUserProfile(data.user)
      }
      
      return data
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      // Don't throw error for sign out, just log it
    }
  },

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  },

  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  },

  async ensureUserProfile(user) {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from(TABLES.USERS_PROFILE)
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError)
      }

      if (!existingProfile) {
        const profileData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: user.email === 'admin@gateway.com' ? 'admin' : 'user'
        }

        const { error: insertError } = await supabase
          .from(TABLES.USERS_PROFILE)
          .insert(profileData)
        
        if (insertError) {
          console.error('Error creating user profile:', insertError)
          // Don't throw error, profile creation is not critical for auth
        }
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error)
      // Don't throw error, profile creation is not critical for auth
    }
  },

  async getCurrentUser() {
    try {
      // Check for demo user first
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        const user = JSON.parse(demoUser)
        const profile = {
          id: user.id,
          full_name: 'Admin User',
          role: 'admin'
        }
        return { ...user, profile }
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null

      // Get user profile
      const { data: profile } = await supabase
        .from(TABLES.USERS_PROFILE)
        .select('*')
        .eq('id', user.id)
        .single()

      return { ...user, profile }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
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
    return data || []
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
    return data || []
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
        status: LICENSE_STATUS.ACTIVE
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
        ip_address: 'unknown',
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
        hwid: hwid
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
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from(TABLES.ANALYTICS_EVENTS)
        .insert({
          event_type: eventType,
          license_id: licenseId,
          user_id: user?.id,
          metadata
        })
    } catch (error) {
      console.error('Error logging analytics event:', error)
    }
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
    return data || []
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
    try {
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
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return {
        totalLicenses: 0,
        activeLicenses: 0,
        totalUsers: 0,
        totalProducts: 0,
        recentActivities: []
      }
    }
  },

  async getRevenueStats() {
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
  },

  async generateRevenueReport() {
    const licenses = await licensesService.getAll()
    const products = await productsService.getAll()
    
    const revenue = licenses.reduce((total, license) => {
      const product = products.find(p => p.id === license.product_id)
      return total + (product?.price || 0)
    }, 0)

    return {
      generatedAt: new Date().toISOString(),
      totalRevenue: revenue,
      totalLicenses: licenses.length,
      averageRevenuePerLicense: licenses.length > 0 ? revenue / licenses.length : 0,
      revenueByProduct: products.map(product => {
        const productLicenses = licenses.filter(l => l.product_id === product.id)
        return {
          productName: product.name,
          licenseCount: productLicenses.length,
          revenue: productLicenses.length * product.price
        }
      })
    }
  },

  async generateFullReport() {
    const [licenseReport, userReport, revenueReport] = await Promise.all([
      this.generateLicenseReport(),
      this.generateUserReport(),
      this.generateRevenueReport()
    ])

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalLicenses: licenseReport.totalLicenses,
        totalUsers: userReport.totalUsers,
        totalRevenue: revenueReport.totalRevenue
      },
      licenses: licenseReport,
      users: userReport,
      revenue: revenueReport
    }
  }
}