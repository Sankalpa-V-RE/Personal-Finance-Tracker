// Use environment variable if available (Docker/Prod), otherwise fallback to hardcoded (Local/Dev)
export const API_URL = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://52.45.42.182:3001/api";
