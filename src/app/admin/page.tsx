"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";
import RouteGuard from "@/components/RouteGuard";

let socket: any;

export default function UserPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checking, setChecking] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('user')

    if(userId){
      console.log(userId)

      socket =  io(`http://localhost:5000`);

      socket.on("connect", () => {
        console.log("Conectado ao WebSocket");
        socket.emit('check-status', userId)
      });
  
      socket.on("qr-code", (qr: any) => {
        console.log(qr)
        setQrCode(qr);
      });
  
      socket.on("session-started", (message: any) => {
        console.log(message.status)
        setIsLoading(false)
        setSessionStatus(message.status);
        // setQrCode(null); // Remove o QR Code após a conexão
      });
  
      socket.on("error", (message: any) => {
        alert(message);
      });
  
      socket.on('disconnected', ()=>{
        setSessionStatus(null)
        setIsLoading(false)
      })
    }

  }, []);

  useEffect(()=>{
    if(checking === true){
      const userId = localStorage.getItem('user')
      setIsLoading(true)
      socket.emit('connected', userId)
    }
  }, [checking])

  const startSession = () => {
    const userId = localStorage.getItem('user')
    socket.emit("start-session", userId);
    setChecking(true)
  };

  const deleteSession = () => {
    const userId = localStorage.getItem('user')
    socket.emit("delete-session", userId);
  };

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <RouteGuard>
      <div className="content-center h-screen w-96">
      <h2 className="w-full text-2xl mb-4 text-center">Dashboard</h2>
      {sessionStatus ? (
        <>
          <div className="bg-white p-6 rounded shadow-md content-center">
            <p className="w-full text-center mb-4">
              Status da sessão: {sessionStatus}
            </p>
            <button onClick={deleteSession} className="bg-red-500 text-white p-2 rounded w-full">
              Finalizar Sessão
            </button>
          </div>
        </>
      ) : qrCode ? (
        <div className="bg-white p-6 rounded shadow-md content-center">
          <p className="w-full text-center mb-4">Escaneie o QR Code abaixo:</p>
          <QRCodeCanvas className="justify-self-center" value={qrCode} size={256} />
        </div>
      ) : isLoading ? (
        <>
          <div className="bg-white p-6 rounded shadow-md content-center">
            <p className="w-full text-center mb-4">Carregando...</p>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded shadow-md content-center">
           <p className="w-full text-center mb-4">Nenhuma sessão ativa</p>
          <button onClick={startSession} className=" w-full bg-green-500 text-white p-2 rounded">
          Iniciar Sessão
          </button>
        </div>
      )
      }
      <p className="text-center mt-4 link hover:underline decoration-red-500 cursor-pointer" onClick={logout}>Logout</p>
    </div>
    </RouteGuard>    
  );
}
