import { apiPost } from '../../api/client.js'

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