import { apiPost } from '../../api/client.js'

export function login(email, password) {
  return apiPost('/api/auth/login', { email, password })
}


export function register(fullName, email, password) {
  return apiPost('/api/auth/register', {
    full_name: fullName,
    email,
    password,
  })
}