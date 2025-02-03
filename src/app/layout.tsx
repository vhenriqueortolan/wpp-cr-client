'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  if (pathname == '/login'){
    return (
      <AuthProvider>
        <html lang="pt-br">
          <body className={`${geistSans.variable} ${geistMono.variable} overflow-hidden flex justify-center items-center`}>
            {children}
          </body>
        </html>
      </AuthProvider>
    )
  } else {
    return (
      <AuthProvider>
        <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} box-content overflow-hidden`}>
          <MainLayout>
            {children}
          </MainLayout>
        </body>
      </html>
      </AuthProvider>
    );
  }
  
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth(); // Agora podemos usar o contexto

  return (
    <>
      <nav className="h-12 w-full px-8 flex items-center justify-between bg-orange-500 text-white font-bold">
        {user ? (
          <>
          <span className="">olá, {user.name}!</span>
          <div className="flex items-center space-x-4">
            {user.role == 'admin' ? (
              <>
              <a className="inline hover:underline decoration-black cursor-pointer" href="/booking/list">agendamentos</a>
              <a className="inline hover:underline decoration-black cursor-pointer" href="/">painel admin</a>
              <p onClick={logout} className="justify-self-end inline hover:underline decoration-black cursor-pointer">logout</p>
              </>
            ) : (
              <li><span className="hover:underline decoration-red-500 cursor-pointer" onClick={logout}>logout</span></li>
            )}
          </div>
        </>
        ) : (
          <span>Não autenticado</span>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
};