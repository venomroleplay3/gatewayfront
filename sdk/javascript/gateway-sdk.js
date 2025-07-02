/**
 * GateWay License SDK for JavaScript/Node.js
 * Version: 1.0.0
 */

class GatewaySDK {
  constructor(options = {}) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl || 'https://your-project.supabase.co/functions/v1'
    this.timeout = options.timeout || 30000
    
    if (!this.apiKey) {
      throw new Error('API key is required')
    }
  }

  /**
   * Validate a license
   * @param {string} licenseKey - The license key to validate
   * @param {string} hwid - Hardware ID of the machine
   * @param {string} productId - Optional product ID for additional validation
   * @returns {Promise<Object>} Validation result
   */
  async validateLicense(licenseKey, hwid, productId = null) {
    try {
      const response = await this._makeRequest('/license-api/validate', 'POST', {
        license_key: licenseKey,
        hwid: hwid,
        product_id: productId
      })

      return response
    } catch (error) {
      throw new Error(`License validation failed: ${error.message}`)
    }
  }

  /**
   * Activate a license on current machine
   * @param {string} licenseKey - The license key to activate
   * @param {string} hwid - Hardware ID of the machine
   * @param {string} machineName - Optional machine name
   * @returns {Promise<Object>} Activation result
   */
  async activateLicense(licenseKey, hwid, machineName = null) {
    try {
      const response = await this._makeRequest('/license-api/activate', 'POST', {
        license_key: licenseKey,
        hwid: hwid,
        machine_name: machineName
      })

      return response
    } catch (error) {
      throw new Error(`License activation failed: ${error.message}`)
    }
  }

  /**
   * Deactivate a license from current machine
   * @param {string} licenseKey - The license key to deactivate
   * @param {string} hwid - Hardware ID of the machine
   * @returns {Promise<Object>} Deactivation result
   */
  async deactivateLicense(licenseKey, hwid) {
    try {
      const response = await this._makeRequest('/license-api/deactivate', 'POST', {
        license_key: licenseKey,
        hwid: hwid
      })

      return response
    } catch (error) {
      throw new Error(`License deactivation failed: ${error.message}`)
    }
  }

  /**
   * Get license information
   * @param {string} licenseKey - The license key
   * @returns {Promise<Object>} License information
   */
  async getLicenseInfo(licenseKey) {
    try {
      const response = await this._makeRequest(`/license-api/info?license_key=${licenseKey}`, 'GET')
      return response
    } catch (error) {
      throw new Error(`Failed to get license info: ${error.message}`)
    }
  }

  /**
   * Send heartbeat to keep license active
   * @param {string} licenseKey - The license key
   * @param {string} hwid - Hardware ID of the machine
   * @param {string} status - Current application status
   * @returns {Promise<Object>} Heartbeat result
   */
  async sendHeartbeat(licenseKey, hwid, status = 'running') {
    try {
      const response = await this._makeRequest('/license-api/heartbeat', 'POST', {
        license_key: licenseKey,
        hwid: hwid,
        status: status
      })

      return response
    } catch (error) {
      throw new Error(`Heartbeat failed: ${error.message}`)
    }
  }

  /**
   * Generate hardware ID for current machine
   * @returns {string} Hardware ID
   */
  generateHWID() {
    if (typeof window !== 'undefined') {
      // Browser environment
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Hardware fingerprint', 2, 2)
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|')
      
      return this._hashString(fingerprint)
    } else {
      // Node.js environment
      const os = require('os')
      const crypto = require('crypto')
      
      const machineId = [
        os.hostname(),
        os.arch(),
        os.platform(),
        os.cpus()[0].model,
        Object.values(os.networkInterfaces())
          .flat()
          .find(i => !i.internal && i.mac !== '00:00:00:00:00:00')?.mac || 'unknown'
      ].join('|')
      
      return crypto.createHash('md5').update(machineId).digest('hex')
    }
  }

  /**
   * Start automatic heartbeat
   * @param {string} licenseKey - The license key
   * @param {string} hwid - Hardware ID
   * @param {number} interval - Heartbeat interval in milliseconds (default: 5 minutes)
   * @returns {number} Interval ID for stopping heartbeat
   */
  startHeartbeat(licenseKey, hwid, interval = 300000) {
    return setInterval(async () => {
      try {
        await this.sendHeartbeat(licenseKey, hwid)
      } catch (error) {
        console.error('Heartbeat error:', error.message)
      }
    }, interval)
  }

  /**
   * Stop automatic heartbeat
   * @param {number} intervalId - The interval ID returned by startHeartbeat
   */
  stopHeartbeat(intervalId) {
    clearInterval(intervalId)
  }

  /**
   * Make HTTP request to API
   * @private
   */
  async _makeRequest(endpoint, method, data = null) {
    const url = `${this.baseUrl}${endpoint}`
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      }
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    options.signal = controller.signal

    try {
      const response = await fetch(url, options)
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  /**
   * Hash string using simple algorithm
   * @private
   */
  _hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GatewaySDK
} else if (typeof window !== 'undefined') {
  window.GatewaySDK = GatewaySDK
}