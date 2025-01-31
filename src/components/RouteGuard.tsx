"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redireciona para login se não houver token
    } else {
      setIsAuth(true); // Define autenticado
    }
  }, []);

  if (isAuth === null) {
    return <div>Carregando...</div>; // Exibe um loader enquanto verifica o token
  }

  return <>{children}</>;
};

export default RouteGuard;
