const request = (path, props = {}) => {
  const token = localStorage.getItem('token')
  const { params } = props

  const buildQueryString = (params) => {
    return new URLSearchParams(params).toString()
  }

  const queryString = buildQueryString(params)
  const fullPath = queryString ? `${path}?${queryString}` : path

  return fetch(`${import.meta.env.VITE_API_BASE_URL}${fullPath}`, {
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
