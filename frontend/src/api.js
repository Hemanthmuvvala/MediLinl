// Reads VITE_API_URL from .env on Vercel (production)
// Falls back to '' so the Vite proxy handles it locally (development)
const API = import.meta.env.VITE_API_URL || '';
export default API;
