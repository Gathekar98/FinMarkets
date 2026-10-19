import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, authConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const notConfigured = () => {
  throw new Error('Sign-in is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
};

/** Friendlier messages for the most common Supabase auth errors. */
const friendly = (error) => {
  const m = error?.message || '';
  if (/Invalid login credentials/i.test(m)) return new Error('Incorrect email or password.');
  if (/Email not confirmed/i.test(m)) return new Error('Please confirm your email first — check your inbox for the link we sent.');
  if (/User already registered/i.test(m)) return new Error('An account with this email already exists. Try signing in instead.');
  if (/Password should be/i.test(m)) return new Error('Password must be at least 8 characters.');
  if (/rate limit/i.test(m)) return new Error('Too many attempts. Please wait a minute and try again.');
  return error;
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(authConfigured);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    const run = async (p) => {
      const { data, error } = await p;
      if (error) throw friendly(error);
      return data;
    };
    const origin = window.location.origin;
    return {
      configured: authConfigured,
      loading,
      session,
      user: session?.user ?? null,
      displayName: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '',
      signIn: (email, password) => (supabase ? run(supabase.auth.signInWithPassword({ email, password })) : notConfigured()),
      signUp: (email, password, fullName) =>
        supabase
          ? run(supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${origin}/account` } }))
          : notConfigured(),
      signInWithGoogle: () =>
        supabase ? run(supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/account` } })) : notConfigured(),
      sendReset: (email) =>
        supabase ? run(supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` })) : notConfigured(),
      updatePassword: (password) => (supabase ? run(supabase.auth.updateUser({ password })) : notConfigured()),
      updateProfile: (fullName) => (supabase ? run(supabase.auth.updateUser({ data: { full_name: fullName } })) : notConfigured()),
      signOut: () => (supabase ? supabase.auth.signOut() : null),
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
