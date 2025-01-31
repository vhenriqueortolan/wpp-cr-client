"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dotenv from 'dotenv'

dotenv.config()

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true)

    const res = await fetch(`http://localhost:5000/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
        setLoading(false)
        setError(data.error);
        return;
    }

    console.log(data.user)

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.user);
    localStorage.setItem("role", data.role);

    if(data.role == 'admin'){
        router.push(`/admin`);
        return
    }
    router.push(`/user/${data.userId}`);
  };

  return (
    <div className="flex justify-center items-center h-full">
      {!loading ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4">Login</h2>
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
            <button className="w-full bg-blue-500 text-white p-2 rounded">Entrar</button>
      </form>
      ) : (
        <p>Entrando...</p>
      )}
    </div>
  );
}
