"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function PainelJogoAoVivo() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados do cronômetro
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState("1T");

  // Formulário rápido de evento
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  // Carrega dados da partida
  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/jogos/${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setMatchData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  // Lógica do Cronômetro
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentMinute = Math.floor(seconds / 60) + 1;

  // Enviar evento (Gol, Cartão, Falta)
  const handleRegisterEvent = async (eventType: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/jogos/${matchId}/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          playerId: selectedPlayer || null,
          minute: currentMinute,
          period,
          teamType: selectedTeam,
        }),
      });

      if (res.ok) {
        setSelectedPlayer("");
        await fetchMatch();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Mudar Status da Partida
  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/jogos/${matchId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (newStatus === "ENCERRADO") {
        setIsRunning(false);
      }
      await fetchMatch();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Carregando painel do jogo...
      </div>
    );
  }

  const homePlayers = matchData?.homeTeam?.players || [];
  const awayPlayers = matchData?.awayTeam?.players || [];
  const currentPlayers = selectedTeam === "home" ? homePlayers : awayPlayers;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Topo / Header Branco */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/painel" className="relative w-44 h-10 flex items-center">
            <Image src="/logo.png" alt="Copa Digital" fill className="object-contain object-left" />
          </Link>
          <span className="text-xs font-bold text-slate-700 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Painel de Arbitragem / Súmula
          </span>
        </div>
      </header>

      {/* Conteúdo Operacional */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Placar Principal e Cronômetro */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-red-400">
              {matchData?.status || "AO VIVO"} • {period}
            </span>
          </div>

          {/* Confronto e Placar */}
          <div className="grid grid-cols-3 items-center gap-2 py-4">
            <div className="text-right">
              <h2 className="text-lg sm:text-2xl font-black text-white">{matchData?.homeTeam?.name || "Mandante"}</h2>
            </div>

            <div className="flex justify-center items-center gap-3">
              <span className="text-4xl sm:text-6xl font-black text-cyan-400 font-mono">
                {matchData?.homeScore ?? 0}
              </span>
              <span className="text-2xl text-slate-600 font-bold">x</span>
              <span className="text-4xl sm:text-6xl font-black text-cyan-400 font-mono">
                {matchData?.awayScore ?? 0}
              </span>
            </div>

            <div className="text-left">
              <h2 className="text-lg sm:text-2xl font-black text-white">{matchData?.awayTeam?.name || "Visitante"}</h2>
            </div>
          </div>

          {/* Cronômetro */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="text-3xl sm:text-4xl font-mono font-black text-white bg-slate-950 px-6 py-2 rounded-2xl border border-slate-800">
              {formatTimer(seconds)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsRunning(!isRunning);
                  if (!isRunning && matchData?.status === "AGENDADO") {
                    handleStatusChange("EM_ANDAMENTO");
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                  isRunning
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                }`}
              >
                {isRunning ? "Pausar" : "Iniciar Tempo"}
              </button>

              <button
                onClick={() => setPeriod(period === "1T" ? "2T" : "1T")}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-700"
              >
                Mudar p/ {period === "1T" ? "2T" : "1T"}
              </button>

              <button
                onClick={() => handleStatusChange("ENCERRADO")}
                className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 px-4 py-2.5 rounded-xl font-bold text-xs"
              >
                Finalizar Partida
              </button>
            </div>
          </div>
        </div>

        {/* Lançamento Rápido de Ações */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Anotar Evento da Partida ({currentMinute}&apos;)
          </h3>

          {/* Selecionar Equipe */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => {
                setSelectedTeam("home");
                setSelectedPlayer("");
              }}
              className={`py-3 rounded-xl font-bold text-xs transition border ${
                selectedTeam === "home"
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              {matchData?.homeTeam?.name || "Mandante"}
            </button>

            <button
              onClick={() => {
                setSelectedTeam("away");
                setSelectedPlayer("");
              }}
              className={`py-3 rounded-xl font-bold text-xs transition border ${
                selectedTeam === "away"
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              {matchData?.awayTeam?.name || "Visitante"}
            </button>
          </div>

          {/* Selecionar Atleta */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Atleta envolvido no lance:
            </label>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="">Nenhum atleta selecionado (ou não identificado)</option>
              {currentPlayers.map((p: any) => (
                <option key={p.id} value={p.id}>
                  #{p.number || "S/N"} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              disabled={actionLoading}
              onClick={() => handleRegisterEvent("GOL")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
            >
              ⚽ Gol (+1)
            </button>

            <button
              disabled={actionLoading}
              onClick={() => handleRegisterEvent("CARTAO_AMARELO")}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-950/50"
            >
              🟨 Amarelo
            </button>

            <button
              disabled={actionLoading}
              onClick={() => handleRegisterEvent("CARTAO_VERMELHO")}
              className="bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-red-950/50"
            >
              🟥 Vermelho
            </button>

            <button
              disabled={actionLoading}
              onClick={() => handleRegisterEvent("FALTA")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition border border-slate-700"
            >
              🚫 Falta
            </button>
          </div>
        </div>

        {/* Linha do Tempo dos Fatos */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Linha do Tempo do Jogo
          </h3>

          {!matchData?.events || matchData.events.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Nenhum evento registrado ainda. Inicie o tempo e anote os lances.
            </p>
          ) : (
            <div className="space-y-3">
              {matchData.events.map((ev: any) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      {ev.minute}&apos;
                    </span>
                    <span className="font-bold text-white uppercase tracking-wider">
                      {ev.eventType.replace("_", " ")}
                    </span>
                    {ev.player && (
                      <span className="text-slate-400">
                        • #{ev.player.number || ""} {ev.player.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{ev.period}</span>
                </div>
              ))}
            </div>
          )}
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