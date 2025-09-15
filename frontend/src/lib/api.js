import axios from 'axios'
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' })


export const setToken = (token) => {
if (token) { localStorage.setItem('token', token); API.defaults.headers.common['Authorization'] = `Bearer ${token}` }
else { localStorage.removeItem('token'); delete API.defaults.headers.common['Authorization'] }
}
const token = localStorage.getItem('token'); if (token) setToken(token)


export default API