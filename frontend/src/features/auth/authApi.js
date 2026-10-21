import { apiGet, apiPost } from '../../api/client.js'

export function login(email, password) {
  return apiPost('/api/auth/login', { email, password })
}


export function register({ firstName, lastName, email, phone, password }) {
  return apiPost('/api/auth/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    password,
  })
}

export function getMe() {
  return apiGet('/api/auth/me')
}

export function logout() {
  return apiPost('/api/auth/logout')
}