import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface LicenseValidationRequest {
  license_key: string
  hwid: string
  product_id?: string
}

interface LicenseActivationRequest {
  license_key: string
  hwid: string
  machine_name?: string
  ip_address?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/license-api', '')
    const method = req.method

    // API Key Authentication
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Route handling
    switch (path) {
      case '/validate':
        if (method === 'POST') {
          return await validateLicense(req, supabaseClient)
        }
        break

      case '/activate':
        if (method === 'POST') {
          return await activateLicense(req, supabaseClient)
        }
        break

      case '/deactivate':
        if (method === 'POST') {
          return await deactivateLicense(req, supabaseClient)
        }
        break

      case '/info':
        if (method === 'GET') {
          return await getLicenseInfo(req, supabaseClient)
        }
        break

      case '/heartbeat':
        if (method === 'POST') {
          return await sendHeartbeat(req, supabaseClient)
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function validateLicense(req: Request, supabase: any) {
  try {
    const body: LicenseValidationRequest = await req.json()
    const { license_key, hwid, product_id } = body

    if (!license_key || !hwid) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'License key and HWID are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get license with product info
    let query = supabase
      .from('licenses')
      .select(`
        *,
        products (id, name, version),
        users_profile (full_name, company)
      `)
      .eq('license_key', license_key)

    if (product_id) {
      query = query.eq('product_id', product_id)
    }

    const { data: license, error } = await query.single()

    if (error || !license) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'License not found' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check license status
    if (license.status !== 'active') {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `License is ${license.status}` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      // Update license status to expired
      await supabase
        .from('licenses')
        .update({ status: 'expired' })
        .eq('id', license.id)

      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'License has expired' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check HWID if license is already activated
    if (license.hwid && license.hwid !== hwid) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'License is bound to different hardware' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'license_validated',
        license_id: license.id,
        metadata: { hwid, ip_address: getClientIP(req) }
      })

    return new Response(
      JSON.stringify({
        valid: true,
        license: {
          id: license.id,
          license_key: license.license_key,
          product: {
            id: license.products.id,
            name: license.products.name,
            version: license.products.version
          },
          user: {
            name: license.users_profile?.full_name,
            company: license.users_profile?.company
          },
          status: license.status,
          expires_at: license.expires_at,
          max_activations: license.max_activations,
          current_activations: license.current_activations
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Validation failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function activateLicense(req: Request, supabase: any) {
  try {
    const body: LicenseActivationRequest = await req.json()
    const { license_key, hwid, machine_name, ip_address } = body

    if (!license_key || !hwid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License key and HWID are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get license
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single()

    if (error || !license) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License not found' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if already activated on this machine
    const { data: existingActivation } = await supabase
      .from('license_activations')
      .select('*')
      .eq('license_id', license.id)
      .eq('hwid', hwid)
      .eq('is_active', true)
      .single()

    if (existingActivation) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'License already activated on this machine',
          activation_id: existingActivation.id
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check activation limit
    if (license.current_activations >= license.max_activations) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Maximum activations reached' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create activation record
    const { data: activation, error: activationError } = await supabase
      .from('license_activations')
      .insert({
        license_id: license.id,
        hwid,
        ip_address: ip_address || getClientIP(req),
        user_agent: req.headers.get('user-agent') || 'Unknown',
        metadata: { machine_name }
      })
      .select()
      .single()

    if (activationError) {
      throw activationError
    }

    // Update license
    await supabase
      .from('licenses')
      .update({
        current_activations: license.current_activations + 1,
        hwid: license.hwid || hwid // Set HWID if not already set
      })
      .eq('id', license.id)

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'license_activated',
        license_id: license.id,
        metadata: { hwid, machine_name, ip_address }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'License activated successfully',
        activation_id: activation.id,
        activated_at: activation.activated_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Activation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Activation failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function deactivateLicense(req: Request, supabase: any) {
  try {
    const body = await req.json()
    const { license_key, hwid } = body

    if (!license_key || !hwid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License key and HWID are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get license
    const { data: license } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single()

    if (!license) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License not found' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Deactivate
    const { error } = await supabase
      .from('license_activations')
      .update({ 
        is_active: false, 
        deactivated_at: new Date().toISOString() 
      })
      .eq('license_id', license.id)
      .eq('hwid', hwid)
      .eq('is_active', true)

    if (error) throw error

    // Update license activation count
    await supabase
      .from('licenses')
      .update({
        current_activations: Math.max(0, license.current_activations - 1)
      })
      .eq('id', license.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'License deactivated successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Deactivation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Deactivation failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getLicenseInfo(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const license_key = url.searchParams.get('license_key')

    if (!license_key) {
      return new Response(
        JSON.stringify({ 
          error: 'License key is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: license, error } = await supabase
      .from('licenses')
      .select(`
        *,
        products (name, version),
        users_profile (full_name, company),
        license_activations!inner (hwid, activated_at, is_active)
      `)
      .eq('license_key', license_key)
      .single()

    if (error || !license) {
      return new Response(
        JSON.stringify({ 
          error: 'License not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        license: {
          id: license.id,
          license_key: license.license_key,
          status: license.status,
          expires_at: license.expires_at,
          max_activations: license.max_activations,
          current_activations: license.current_activations,
          product: license.products,
          user: license.users_profile,
          activations: license.license_activations
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Get info error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get license info' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function sendHeartbeat(req: Request, supabase: any) {
  try {
    const body = await req.json()
    const { license_key, hwid, status } = body

    if (!license_key || !hwid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License key and HWID are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get license
    const { data: license } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single()

    if (!license) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'License not found' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log heartbeat
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'license_heartbeat',
        license_id: license.id,
        metadata: { 
          hwid, 
          status, 
          ip_address: getClientIP(req),
          timestamp: new Date().toISOString()
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Heartbeat received',
        server_time: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Heartbeat error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Heartbeat failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown'
}