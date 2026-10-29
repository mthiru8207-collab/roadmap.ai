import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  isSupabaseConnected: boolean;
  toggleDemoMode: (val: boolean) => void;
  signInWithDemoUser: () => void;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-engineer',
  email: 'alex.engineer@roadmapai.internal',
  name: 'Alex Rivera',
  isGuest: true,
  created_at: '2026-10-15T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(storage.isDemoMode());
  const isSupabaseConnected = isSupabaseConfigured();

  const parseSupabaseUser = (sbUser: any): UserProfile => {
    return {
      id: sbUser.id,
      email: sbUser.email || 'user@roadmapai.com',
      name:
        sbUser.user_metadata?.full_name ||
        sbUser.user_metadata?.name ||
        sbUser.email?.split('@')[0] ||
        'Learner',
      avatarUrl:
        sbUser.user_metadata?.avatar_url ||
        sbUser.user_metadata?.picture ||
        undefined,
      isGuest: false,
      created_at: sbUser.created_at || new Date().toISOString(),
    };
  };

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConnected && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(parseSupabaseUser(session.user));
            setIsDemoMode(false);
            storage.setDemoMode(false);
          } else {
            // Default to demo user for frictionless review
            if (isDemoMode) {
              setUser(DEFAULT_DEMO_USER);
            }
          }
        } catch (err) {
          console.warn('Supabase session load error:', err);
          setUser(DEFAULT_DEMO_USER);
        }
      } else {
        // No Supabase config, seamlessly run in Demo Mode
        setUser(DEFAULT_DEMO_USER);
        setIsDemoMode(true);
      }
      setLoading(false);
    }

    initAuth();

    if (isSupabaseConnected && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(parseSupabaseUser(session.user));
          setIsDemoMode(false);
          storage.setDemoMode(false);
        } else {
          if (isDemoMode) {
            setUser(DEFAULT_DEMO_USER);
          } else {
            setUser(null);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isSupabaseConnected, isDemoMode]);

  const toggleDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    storage.setDemoMode(val);
    if (val) {
      setUser(DEFAULT_DEMO_USER);
    } else if (!isSupabaseConnected) {
      setUser(null);
    }
  };

  const signInWithDemoUser = () => {
    setIsDemoMode(true);
    storage.setDemoMode(true);
    setUser(DEFAULT_DEMO_USER);
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConnected || !supabase) {
      return {
        error: 'Supabase credentials not configured. Please enter your Supabase Project URL and Anon Key in Settings or the database setup box below.',
      };
    }

    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to initialize Google login.' };
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConnected || !supabase) {
      return {
        error: 'Supabase credentials not configured. Please enter your Supabase Project URL and Anon Key.',
      };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ error?: string }> => {
    if (!isSupabaseConnected || !supabase) {
      return {
        error: 'Supabase credentials not configured. Please enter your Supabase Project URL and Anon Key.',
      };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConnected && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoMode(false);
    storage.setDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        isSupabaseConnected,
        toggleDemoMode,
        signInWithDemoUser,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
