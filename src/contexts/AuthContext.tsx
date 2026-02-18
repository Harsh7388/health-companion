import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Profile {
  name: string;
  age: number | null;
  avatar_url: string | null;
}

interface AppUser {
  id: string;
  email: string;
  name: string;
  age: number | null;
  isAdmin: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string, age: number) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

async function buildAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, age, avatar_url')
    .eq('user_id', supabaseUser.id)
    .maybeSingle();

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', supabaseUser.id);

  const isAdmin = roles?.some((r: any) => r.role === 'admin') ?? false;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: profile?.name ?? supabaseUser.email?.split('@')[0] ?? '',
    age: profile?.age ?? null,
    isAdmin,
    createdAt: new Date(supabaseUser.created_at),
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Listen for ONGOING auth changes — does NOT control isLoading
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);

      if (newSession?.user) {
        // Defer to avoid deadlock with Supabase client
        setTimeout(async () => {
          if (!isMounted) return;
          const appUser = await buildAppUser(newSession.user);
          if (isMounted) setUser(appUser);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // INITIAL load — controls isLoading
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(initialSession);

        if (initialSession?.user) {
          // Await role check BEFORE setting loading false
          const appUser = await buildAppUser(initialSession.user);
          if (isMounted) setUser(appUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string, age: number) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name, age },
      },
    });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Please check your email to verify your account.' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
