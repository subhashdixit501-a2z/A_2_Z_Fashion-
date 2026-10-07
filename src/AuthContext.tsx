import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAdmin(false);
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'admins', user.uid));
          setIsAdmin(snap.exists() && snap.data()?.role === 'admin');
        } catch {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try { await signInWithEmailAndPassword(auth, email.trim(), pass); }
    catch (err: any) { const msg = err?.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (err?.message || 'Failed to sign in.'); setError(msg); throw new Error(msg); }
  };
  const registerWithEmail = async (email: string, pass: string) => {
    setError(null);
    try { await createUserWithEmailAndPassword(auth, email.trim(), pass); }
    catch (err: any) { const msg = err?.code === 'auth/email-already-in-use' ? 'This email is already registered.' : (err?.message || 'Failed to create account.'); setError(msg); throw new Error(msg); }
  };
  const logout = async () => { setError(null); await signOut(auth); };
  const resetPassword = async (email: string) => { setError(null); try { await sendPasswordResetEmail(auth, email.trim()); } catch (err: any) { setError(err?.message || 'Failed to send reset email.'); throw err; } };
  const clearError = () => setError(null);

  return <AuthContext.Provider value={{ currentUser, isAdmin, loading, error, loginWithEmail, registerWithEmail, logout, resetPassword, clearError }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; };
