/**
 * Central API Configuration
 * Supports relative path in local dev (via Vite proxy) or full URL in production (e.g. Render/Railway)
 */
export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('localhost:3001')) {
    return envUrl.replace(/\/$/, '');
  }
  return '';
};

