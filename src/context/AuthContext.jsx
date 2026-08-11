import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, verifyToken } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setChecking(false);
      return;
    }
    verifyToken()
      .then(({ user }) => setAdmin(user))
      .catch(() => {
        localStorage.removeItem("admin_token");
        setAdmin(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = async (email, password) => {
    const { token, admin: adminData } = await loginApi(email, password);
    localStorage.setItem("admin_token", token);
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
