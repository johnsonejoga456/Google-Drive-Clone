"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter, usePathname } from "next/navigation";
import { Models } from "appwrite";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.log("AuthContext: CheckUser error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};