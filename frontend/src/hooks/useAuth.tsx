import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User { id: string; name: string; email: string; role: string; }
interface AuthCtx { user: User | null; token: string | null; login: (token: string, user: User) => void; logout: () => void; }

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('ll_token');
    const u = localStorage.getItem('ll_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const login = (t: string, u: User) => {
    localStorage.setItem('ll_token', t);
    localStorage.setItem('ll_user', JSON.stringify(u));
    setToken(t); setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('ll_token');
    localStorage.removeItem('ll_user');
    setToken(null); setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
