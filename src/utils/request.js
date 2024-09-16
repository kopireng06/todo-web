const request = (path, props) => fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, props)

export { request }
