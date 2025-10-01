"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/lib/auth";
import { useHydration } from "@/hooks/useHydration";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isHydrated = useHydration();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const result = await getUserProfile(user.uid);
      if (result.success) {
        setUserProfile(result.profile || null);
      }
    }
  };

  useEffect(() => {
    if (!isHydrated || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Load user profile from Firestore
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setUserProfile(result.profile || null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [isHydrated]);

  const value = {
    user,
    userProfile,
    loading: loading || !isHydrated,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
