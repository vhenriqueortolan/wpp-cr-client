'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="relative h-12 w-full px-8 flex items-center justify-between bg-orange-500 text-white font-bold">
        {user ? (
          <>
          <span className="">olá, {user.name}!</span>
          <div>
          <button onClick={()=>setIsOpen(!isOpen)} className="fixed top-3 right-5 z-10"> {isOpen ? <X size={28} /> : <Menu size={28} />}</button>
            <div className={`${isOpen ? '' : 'hidden overflow-hidden' }fixed flex flex-col items-center space-y-4 bg-orange-500 top-10 right-3 w-[175px] p-6 rounded shadow-md `}>
                <a className="text-center w-full inline cursor-pointer rounded shadow-md hover:bg-orange-600 p-2 hover:scale-110" href="/booking/list">agendamentos</a>
                <a className={`text-center w-full inline  cursor-pointer ${user.role === 'admin' ? '' : 'hidden'} rounded shadow-md hover:bg-orange-600 p-2 hover:scale-110`} href="/dashboard/admin">painel admin</a>
                <p onClick={()=>logout()} className="text-center w-full justify-self-end inline cursor-pointer rounded shadow-md hover:bg-orange-600 p-2 hover:scale-110">logout</p>
            </div>
          </div>
          
        </>
        ) : (
          <span>não autenticado</span>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
};