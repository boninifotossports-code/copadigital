"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface CategoryInput {
  name: string;
  format: string;
}

export default function NovaCompeticaoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<CategoryInput[]>([
    { name: "Principal", format: "PONTOS_CORRIDOS" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCategory = () => {
    setCategories([...categories, { name: "", format: "PONTOS_CORRIDOS" }]);
  };

  const removeCategory = (index: number) => {
    if (categories.length === 1) return;
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof CategoryInput, value: string) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validar se todas as categorias têm nome preenchido
    const hasEmptyCategory = categories.some((c) => !c.name.trim());
    if (hasEmptyCategory) {
      setError("Indique um nome para todas as categorias adicionadas.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/competicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categories }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao registar competição.");
      }

      router.push("/painel");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header Branco */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/painel" className="relative w-48 h-12 flex items-center">
            <Image
              src="/logo.png"
              alt="Logo Copa Digital"
              fill
              className="object-contain object-left"
            />
          </Link>
          <Link
            href="/painel"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            ← Voltar ao Painel
          </Link>
        </div>
      </header>

      {/* Formulário */}
      <main className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white mb-2">Criar Nova Competição</h1>
          <p className="text-sm text-slate-400 mb-8">
            Defina o nome principal e as categorias iniciais que disputarão o torneio.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3.5 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Nome da Competição
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Taça da Cidade 2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Categorias */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Categorias do Torneio
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pode configurar múltiplos escalões (ex: Sub-9, Veteranos, Principal).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  + Adicionar Categoria
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 items-center bg-slate-950 p-3.5 rounded-xl border border-slate-800"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Nome da categoria (ex: Sub-11)"
                      value={cat.name}
                      onChange={(e) => updateCategory(index, "name", e.target.value)}
                      className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />

                    <select
                      value={cat.format}
                      onChange={(e) => updateCategory(index, "format", e.target.value)}
                      className="w-full sm:w-56 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="PONTOS_CORRIDOS">Pontos Corridos</option>
                      <option value="MATA_MATA">Eliminatória Direta (Mata-mata)</option>
                      <option value="GRUPOS_E_MATA_MATA">Fase de Grupos + Eliminatórias</option>
                    </select>

                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3.5 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-6"
            >
              {loading ? "A registar torneio..." : "Concluir e Guardar Torneio"}
            </button>
          </form>
        </div>
      </main>

      {/* Rodapé AB Labs */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600">
        Desenvolvido por{" "}
        <a
          href="https://ablabsweb.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline font-semibold"
        >
          AB Labs
        </a>
      </footer>
    </div>
  );
}