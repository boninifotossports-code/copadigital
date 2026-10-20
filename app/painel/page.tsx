import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function PainelPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Busca a organização do gestor logado
  const org = await prisma.organization.findFirst({
    where: { ownerId: (session.user as any).id },
    include: {
      competitions: {
        include: {
          categories: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Topbar com Header Branco */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/painel" className="relative w-52 h-14 flex items-center">
            <Image
              src="/logo2.png"
              alt="Logo Copa Digital"
              fill
              className="object-contain object-left"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{session.user.name}</p>
              <p className="text-xs text-slate-500 font-semibold">{org?.name || "Gestor"}</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold transition"
            >
              Sair
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Banner de Boas-vindas e Link Público */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              Plano: {org?.planStatus || "TRIAL"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{org?.name}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Sua página pública oficial para torcedores e dirigentes:
            </p>
            <a
              href={`/${org?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-mono text-sm hover:underline mt-1 inline-block"
            >
              copadigital.com/{org?.slug} ↗
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/painel/competicoes/nova"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 text-center"
            >
              + Nova Competição
            </Link>
          </div>
        </div>

        {/* Lista de Competições */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Suas Competições</h2>
            <span className="text-sm text-slate-400">
              {org?.competitions.length || 0} cadastrada(s)
            </span>
          </div>

          {org?.competitions.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-white">Nenhuma competição criada ainda</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-2 mb-6">
                Crie seu primeiro campeonato para configurar categorias, chaves, equipes e súmulas ao vivo.
              </p>
              <Link
                href="/painel/competicoes/nova"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition border border-slate-700"
              >
                Criar Primeiro Torneio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {org?.competitions.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-500/20">
                        {comp.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {comp.categories.length} categoria(s)
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{comp.name}</h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      href={`/painel/competicoes/${comp.id}`}
                      className="text-cyan-400 text-sm font-bold hover:underline"
                    >
                      Gerenciar Competição →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer AB Labs */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>COPA DIGITAL • Do cadastro ao apito final</div>
          <div>
            Desenvolvido por{" "}
            <a
              href="https://ablabsweb.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-semibold"
            >
              AB Labs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}