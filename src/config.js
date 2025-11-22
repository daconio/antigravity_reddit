export const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://your-backend-url.railway.app'
        : 'http://localhost:5001');
