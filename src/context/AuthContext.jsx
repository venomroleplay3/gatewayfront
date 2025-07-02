import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token and set user
      setUser({ id: 1, name: 'Admin User', email: 'admin@gateway.com' })
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = { id: 1, name: 'Admin User', email: credentials.email }
      setUser(mockUser)
      localStorage.setItem('authToken', 'mock-token')
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}