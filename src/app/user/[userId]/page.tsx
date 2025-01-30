"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

import dotenv from 'dotenv'

dotenv.config()

let socket: any;

export default function UserPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    socket =  io(`https://whatsapp-cr.onrender.com`);

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket");
      const userId = '679aadd360278851c41b0cd0';
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
    const userId = '679aadd360278851c41b0cd0';
    socket.emit('connected', userId)
    setIsLoading(true)
  }, [qrCode])

  const startSession = () => {
    const userId = '679aadd360278851c41b0cd0';
    socket.emit("start-session", userId);
  };

  const deleteSession = () => {
    const userId = '679aadd360278851c41b0cd0';
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
