"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

// Interface do usuário autenticado
export interface User {
    name: string,
    userId: string;
    role: string;
}

// Tipagem do contexto
interface AuthContextType {
  user: User | null;
  token: string | null
  login: (user: User, token: AuthContextType['token']) => void;
  logout: () => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

// Provider para envolver a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: User = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        console.error("Token inválido, removendo...");
        localStorage.removeItem("token");
        router.push('/login')
      }
    }
  }, []);

  // Função para login
  const login = (user: User, token: AuthContextType['token']) => {
    console.log({...user})
    setToken(token)
    localStorage.setItem('token', token as string)
    setUser(user);
    router.push(user.role == 'admin' ? "/dashboard/admin" : user.role == 'photo' ? '/booking/list' : `/dashboard/user/${user.userId}`); // Redireciona baseado na role
  };

  // Função para logout
  const logout = async () => {
    const res = await fetch( '/api/auth/logout', { method: 'POST' })
    if(res.ok){
      localStorage.removeItem('token')
      setUser(null);
      setToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
