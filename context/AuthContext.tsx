"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (userId: string, secret: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user session
  const fetchUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (userId: string, secret: string) => {
    try {
      await account.updateMagicURLSession(userId, secret);
      await fetchUser(); // Refresh user data
      router.push("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
