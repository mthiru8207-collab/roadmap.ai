import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'roadmap_ai_supabase_url';
const STORAGE_KEY_ANON = 'roadmap_ai_supabase_anon_key';

export const getSupabaseCredentials = (): { url: string; anonKey: string } => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  let localUrl = '';
  let localKey = '';
  try {
    localUrl = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
    localKey = (localStorage.getItem(STORAGE_KEY_ANON) || '').trim();
  } catch {
    // ignore
  }

  return {
    url: envUrl || localUrl,
    anonKey: envKey || localKey,
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseCredentials();
  return (
    typeof url === 'string' &&
    url.length > 0 &&
    url.startsWith('http') &&
    !url.includes('placeholder') &&
    typeof anonKey === 'string' &&
    anonKey.length > 0 &&
    !anonKey.includes('placeholder')
  );
};

export const saveSupabaseCredentials = (url: string, anonKey: string): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    window.location.reload();
    return true;
  } catch {
    return false;
  }
};

export const clearSupabaseCredentials = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    window.location.reload();
  } catch {
    // ignore
  }
};

const creds = getSupabaseCredentials();

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
