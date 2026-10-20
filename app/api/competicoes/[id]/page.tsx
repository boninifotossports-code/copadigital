import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function DetalhesCompeticaoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Obter detalhes da competição com categorias, equipas e partidas
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: {
      organization: true,
      categories: {
        include: {
          teams: {
            include: {
              players: true,
            },
          },
          matches: {
            include: {
              homeTeam: true,
              awayTeam: true,
              referee: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!competition) {
    notFound();
  }

  // Validar se o utilizador autenticado é proprietário da organização
  if (competition.organization.ownerId !== (session.user as any).id) {
    redirect("/painel");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Topbar com Header Branco */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/painel" className="relative w-52 h-14 flex items-center">
            <Image
              src="/logo.png"
              alt="Logo Copa Digital"
              fill
              className="object-contain object-left"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/painel"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 transition"
            >
              ← Voltar ao Painel
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Cabeçalho da Competição */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-500/20">
                {competition.status}
              </span>
              <span className="text-xs text-slate-400">
                Organização: {competition.organization.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {competition.name}
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/${competition.organization.slug}`}
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg transition"
            >
              Ver Página Pública ↗
            </Link>
          </div>
        </div>

        {/* Listagem de Categorias */}
        <div className="mt-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Categorias em Disputa</h2>
            <span className="text-sm text-slate-400">
              {competition.categories.length} categoria(s)
            </span>
          </div>

          {competition.categories.map((category) => (
            <div
              key={category.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {category.name}
                    <span className="text-xs text-slate-400 font-normal border border-slate-700 px-2 py-0.5 rounded">
                      Formato: {category.format.replace(/_/g, " ")}
                    </span>
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-400 font-medium self-center">
                    {category.teams.length} equipa(s) registada(s)
                  </span>
                </div>
              </div>

              {/* Grelha de Equipas e Jogos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Secção de Equipas */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Equipas Participantes
                    </h4>
                  </div>

                  {category.teams.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      Nenhuma equipa registada nesta categoria ainda.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-800/50">
                      {category.teams.map((team) => (
                        <li
                          key={team.id}
                          className="py-2.5 flex justify-between items-center text-sm"
                        >
                          <span className="font-semibold text-white">
                            {team.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {team.players.length} atleta(s)
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Secção de Jogos e Painel ao Vivo */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Partidas e Confrontos
                    </h4>
                  </div>

                  {category.matches.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      Nenhuma partida agendada.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {category.matches.map((match) => (
                        <div
                          key={match.id}
                          className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div className="text-xs">
                            <span className="font-bold text-white">
                              {match.homeTeam.name}
                            </span>{" "}
                            <span className="text-cyan-400 font-extrabold mx-1">
                              {match.homeScore} x {match.awayScore}
                            </span>{" "}
                            <span className="font-bold text-white">
                              {match.awayTeam.name}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {match.location || "Local a definir"} • Estado:{" "}
                              {match.status}
                            </div>
                          </div>
                          <Link
                            href={`/painel/jogos/${match.id}`}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition"
                          >
                            Operar Jogo
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer AB Labs */}
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