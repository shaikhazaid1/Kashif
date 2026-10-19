import { apiPost } from '../../api/client.js'

export function login(email, password) {
  return apiPost('/api/auth/login', { email, password })
}