import { useEffect, useState } from 'react'
import API, { setToken } from '../lib/api'


export default function useAuth(){
const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)
useEffect(()=>{ API.get('/auth/me').then(r=>{ setUser(r.data.user); setLoading(false) }) },[])
const login = async (email,password)=>{ const r = await API.post('/auth/login',{email,password}); setToken(r.data.token); setUser(r.data.user); return r.data.user }
const register = async (payload)=>{ const r = await API.post('/auth/register',payload); setToken(r.data.token); setUser(r.data.user); return r.data.user }
const logout = ()=>{ setToken(null); setUser(null) }
return { user, loading, login, register, logout }
}