"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    slug: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSlugChange = (text: string) => {
    const formatted = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar o registo.");
      }

      // Redireciona para a página de login com indicador de sucesso
      router.push("/login?registrado=true");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <Link href="/" className="relative w-52 h-14 block">
            <Image
              src="/logo2.png"
              alt="Copa Digital"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1">
          Criar Conta de Gestor
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Configure a sua entidade e comece a gerir as suas competições
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              O seu Nome
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="Ex: Carlos Silva"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Profissional
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="carlos@minhaliga.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Palavra-passe
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nome da Gestão / Liga
            </label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => {
                setFormData({ ...formData, organizationName: e.target.value });
                if (!formData.slug) handleSlugChange(e.target.value);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              placeholder="Ex: Liga Carioca de Futebol"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Link Personalizado da sua Página
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:border-cyan-400 transition">
              <span className="text-slate-500 text-xs px-3 select-none">
                copadigital.com/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full bg-transparent py-2.5 pr-4 text-cyan-400 text-sm focus:outline-none"
                placeholder="liga-carioca"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg text-sm transition mt-4 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {loading ? "A criar entidade..." : "Criar Minha Gestão"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Já possui conta?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
            Entrar no painel
          </Link>
        </div>

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