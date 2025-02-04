"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dotenv from 'dotenv'
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "@/components/LoadingModal";

dotenv.config()

export default function LoginPage(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const {login} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true)
// `https://whatsapp-cr.onrender.com/login`
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data:any = await res.json();
    if (!res.ok) {
        setLoading(false)
        setError(data.error);
        return;
    }

    login(data.user, data.token)
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {!loading ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4 font-bold">login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
            />
            <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
            />
            <button className="w-full bg-orange-500 text-white p-2 rounded">Entrar</button>
      </form>
      ) : (
        <LoadingModal />
      )}
    </div>
  );
}