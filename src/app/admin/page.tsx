"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

import dotenv from 'dotenv'
import { useRouter } from "next/router";

dotenv.config()

let socket: any;

export default function UserPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const userId = localStorage.getItem('user')

    socket =  io(`${process.env.URI}`);

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket");
      socket.emit('check-status', userId)
    });

    socket.on("qr-code", (qr: any) => {
      console.log(qr)
      setQrCode(qr);
    });

    socket.on("session-started", (message: any) => {
      setIsLoading(false)
      setSessionStatus(message.status);
      setQrCode(null); // Remove o QR Code após a conexão
    });

    socket.on("error", (message: any) => {
      alert(message);
    });

    socket.on('disconnected', ()=>{
      setSessionStatus(null)
    })

  }, []);

  useEffect(()=>{
    const userId = localStorage.getItem('user')
    socket.emit('connected', userId)
    setIsLoading(true)
  }, [qrCode])

  const startSession = () => {
    const userId = localStorage.getItem('user')
    socket.emit("start-session", userId);
  };

  const deleteSession = () => {
    const userId = localStorage.getItem('user')
    socket.emit("delete-session", userId);
  };

  return (
    <div className="p-6 justify-items-center">
      <h2 className="text-2xl mb-4 text-center">Dashboard</h2>
      {sessionStatus ? (
        <>
          <div className="size-full justify-items-center itens-center grid grid-cols-1 gap-4">
            <p className="">
              Status: {sessionStatus}
            </p>
            <button onClick={deleteSession} className="bg-red-500 text-white p-2 rounded">
              Finalizar Sessão
            </button>
          </div>
        </>
      ) : qrCode ? (
        <div className="size-full justify-items-center itens-center grid grid-cols-1 gap-4">
          <p>Escaneie o QR Code abaixo:</p>
          <QRCodeCanvas value={qrCode} size={256} />
        </div>
      ) : isLoading ? (
        <>
          <div className="size-full justify-items-center itens-center grid grid-cols-1 gap-4">
            <p>Carregando...</p>
          </div>
        </>
      ) : (
        <>
          <button onClick={startSession} className="bg-green-500 text-white p-2 rounded">
          Iniciar Sessão
          </button>
        </>
      )
      }
    </div>
  );
}
