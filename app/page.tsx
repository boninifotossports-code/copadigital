import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Header / Navegação em Branco (Destaca o novo logo horizontal) */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="relative w-64 h-16 flex items-center justify-start">
              <Image 
                src="/logo2.PNG" 
                alt="Logo Copa Digital" 
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-700 hover:text-cyan-600 transition"
            >
              Entrar
            </Link>
            <a 
              href="#planos" 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-5 py-3 rounded-lg text-sm transition shadow-md shadow-cyan-500/10"
            >
              Criar Competição
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Gestão Esportiva Completa
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Sua competição profissional <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            do cadastro ao apito final
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Tabelas automáticas, chaveamentos, súmulas instantâneas em PDF, página pública personalizada e placar ao vivo lance a lance na palma da mão.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a 
            href="#planos" 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            Começar Agora
          </a>
          <Link 
            href="/explorar" 
            className="border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white font-semibold px-8 py-4 rounded-xl text-base transition flex items-center justify-center gap-2"
          >
            Ver Campeonatos Ativos
          </Link>
        </div>
      </section>

      {/* Grid de Recursos */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold mb-6">
              ⏱
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Painel de Jogo Ao Vivo</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cronômetro integrado, anotação de gols, cartões e faltas com atualização em tempo real para a torcida e dirigentes no celular.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold mb-6">
              📄
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Súmula Automática em PDF</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Acabou o jogo? O sistema gera na hora a súmula oficial formatada com logo do torneio, organização, artilharia e assinaturas.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold mb-6">
              🌐
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Página Própria da Gestão</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Link exclusivo no formato <span className="text-cyan-400 font-mono">/suagestao</span> com todas as suas competições, classificação e estatísticas centralizadas.
            </p>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section id="planos" className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Escolha o plano ideal para a sua liga</h2>
          <p className="mt-4 text-slate-400">Ativação imediata via Mercado Pago com cancelamento a qualquer momento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Plano Básico */}
          <div className="rounded-3xl p-8 bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Torneio Único</span>
              <h3 className="text-2xl font-bold text-white mt-1">Plano Básico</h3>
              <p className="text-slate-400 text-sm mt-2">Para quem organiza uma competição ou evento de fim de semana por vez.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 49,90</span>
                <span className="text-slate-400 text-sm font-medium">/mês</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> 1 Competição ativa simultânea
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Categorias e equipes ilimitadas
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Painel de Jogo e Linha do Tempo ao vivo
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Geração de Súmulas Oficiais em PDF
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Link exclusivo da gestão (/nomedagestao)
                </li>
              </ul>
            </div>

            <Link
              href="/checkout?plano=basico"
              className="mt-8 block text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition border border-slate-700"
            >
              Assinar Plano Básico
            </Link>
          </div>

          {/* Plano Pro */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-cyan-500 flex flex-col justify-between relative shadow-2xl shadow-cyan-950/50">
            <div className="absolute -top-3.5 right-8 bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Mais Recomendado
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Múltiplas Ligas</span>
              <h3 className="text-2xl font-bold text-white mt-1">Plano Pro</h3>
              <p className="text-slate-400 text-sm mt-2">Para complexos esportivos, centros de treinamento e ligas contínuas.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 99,90</span>
                <span className="text-slate-400 text-sm font-medium">/mês</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> <strong className="text-white">Competições simultâneas ilimitadas</strong>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Múltiplos logins exclusivos de arbitragem
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Login isolado por equipe participante
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Estatísticas completas: artilharia, cartões e defesa
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold">✓</span> Suporte prioritário
                </li>
              </ul>
            </div>

            <Link
              href="/checkout?plano=pro"
              className="mt-8 block text-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/25"
            >
              Assinar Plano Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer AB Labs */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">COPA DIGITAL</span>
            <span>•</span>
            <span>Do cadastro ao apito final</span>
          </div>

          <div>
            Desenvolvido por{' '}
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