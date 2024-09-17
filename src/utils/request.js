const request = (path, props = {}) => {
  const token = localStorage.getItem('token')

  return fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    ...props,
    headers: { Authorization: `Bearer ${token}`, ...props.headers }
  }).then(async (res) => {
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json?.message)
    }
    return json
  })
}

export { request }
