import React, { createContext, useContext, useEffect, useState } from 'react'
import API, { setToken } from '../lib/api'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/auth/me')
      .then(r => setUser(r.data.user || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const r = await API.post('/auth/login', { email, password })
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data.user
  }

  const register = async payload => {
    const r = await API.post('/auth/register', payload)
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data.user
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
