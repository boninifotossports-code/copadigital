"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Verifique os dados introduzidos.");
      setLoading(false);
    } else {
      router.push("/painel");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <Link href="/" className="relative w-48 h-14 block">
            <Image
              src="/logo2.PNG"
              alt="Copa Digital"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-1">
          Acessar o Painel
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Gestão de competições, equipes e arbitragem
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="exemplo@gestao.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg text-sm transition mt-2 disabled:opacity-50"
          >
            {loading ? "A entrar..." : "Entrar no Sistema"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Desenvolvido por{" "}
          <a
            href="https://ablabsweb.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            AB Labs
          </a>
        </div>
      </div>
    </div>
  );
}