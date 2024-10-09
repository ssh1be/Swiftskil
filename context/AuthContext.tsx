// context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string, aptchaToken: string) => Promise<void>;
  signUp: (email: string, password: string, aptchaToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsGuest: (captchaToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, captchaToken: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password, options:{captchaToken} });
    if (error) throw error; // Throw error to be handled in UI
  };

  const signUp = async (email: string, password: string, captchaToken: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options:{captchaToken}});
    if (error) throw error; // Throw error to be handled in UI
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error; // Throw error to be handled in UI
  };

  const signInAsGuest = async (captchaToken: string) => {
    const { data, error } = await supabase.auth.signInAnonymously({options: { captchaToken }})
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
