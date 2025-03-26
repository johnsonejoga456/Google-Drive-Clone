"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Models } from "appwrite";

// Define CustomUser with all required fields
interface CustomUser extends Models.User<Models.Preferences> {
  accessedAt: string;
}

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Mock user with all required fields
  const [user, setUser] = useState<CustomUser | null>({
    $id: "mock-user-id",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    email: "test@example.com",
    name: "Test User",
    prefs: {},
    emailVerification: true,
    phone: "",
    phoneVerification: false,
    status: true,
    labels: [],
    passwordUpdate: "",
    registration: "",
    accessedAt: new Date().toISOString(), // Ensure it's a valid string
    mfa: false, // Mock value for multi-factor authentication
    targets: [], // Empty array for targets (if applicable)
  });

  const [loading, setLoading] = useState(false); // Set loading to false since we're bypassing auth

  const logout = async () => {
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
