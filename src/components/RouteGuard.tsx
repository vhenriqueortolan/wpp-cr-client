"use client";
import {jwtDecode} from 'jwt-decode'
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '@/app/context/AuthContext';
import LoadingModal from './LoadingModal';

const RouteGuard =  ({
    children,
  }: {
    children: React.ReactNode;
  }) => {

  const router = useRouter();
  const [loading, setLoading] = useState<boolean | null>(true);
  const pathname = usePathname();
  const {token, user} = useAuth()


  useEffect(() => {
    console.log("Token:", token);
    console.log("User:", user);
    console.log("Pathname:", pathname);

    const publicRoutes = ["/login", "/booking/login"];

    if (!token) {
      console.log("Token não encontrado.");

      if (!publicRoutes.includes(pathname)) {
        console.log("Redirecionando para login.");
        router.push("/login");
      }

      setLoading(false);
      return;
    }

    if (token && !user) {
      console.log("Token encontrado, aguardando carregamento do user...");
      return; // Aguarda o carregamento do user
    }

    if (user) {
      console.log("Usuário autenticado:", user.role);

      if (pathname === "/") {
        if (user.role === "admin") {
          router.push("/");
        } else if (user.role === "user") {
          router.push(`/dashboard/user/${user.userId}`);
        } else if (user.role === "photo") {
          router.push("/booking/list");
        }
        return;
      }

      if (publicRoutes.includes(pathname)) {
        if (user.role === "admin") {
          router.push("/");
        } else if (user.role === "user") {
          router.push(`/dashboard/user/${user.userId}`);
        } else if (user.role === "photo") {
          router.push("/booking/list");
        }
        return;
      }
    }

    setLoading(false);
  }, [token, user, router, pathname]);

    return (
    <> 
         { loading ? <LoadingModal /> : children}
    </>); 
};

export default RouteGuard;
