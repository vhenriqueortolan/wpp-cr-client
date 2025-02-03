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
  token: string | null;
  login: (token: string) => void;
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
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: User = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        console.error("Token inválido, removendo...");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Função para login
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded: User = jwtDecode(newToken);
    console.log({...decoded})
    setUser(decoded);
    setToken(newToken);
    router.push(decoded.role == 'admin' ? "/" : decoded.role == 'photo' ? '/booking/list' : `/dashboard/user/${decoded.userId}`); // Redireciona baseado na role
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
