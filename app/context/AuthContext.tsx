"use client";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";
import supabase from "../util/supabaseClient";

export type User = SupabaseUser;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    } else {
      console.log("User Logged Out Successfully !");
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const loadCurrentUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ user, loading, loginWithGoogle, logOut, supabase }),
    [loading, user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useUserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }
  return context;
};
