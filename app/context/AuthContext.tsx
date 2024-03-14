import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface User {
  // Define your user type here if available
  // For example:
  // id: string;
  // email: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

if (!SUPABASE_KEY || !SUPABASE_URL) {
  throw new Error("Supabase key or URL not provided");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
    // Set up a listener for auth changes right after component mounts
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    // Check the current session synchronously and set the user (alternative approach if available)
    const currentSession = supabase.auth.getUser();
    setUser(currentSession || null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, loginWithGoogle, logOut }),
    [user],
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
