export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : 'Something went wrong. Please try again.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

export function apiGet(path) {
  return apiRequest(path)
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body })
}