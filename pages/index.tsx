import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { Titulo } from "../components/Titulo";
import { ObjetivoCarreira } from "../components/ObjetivoCarreira";
import { HabilidadesFundamentais } from "../components/HabilidadesFundamentais";
import { PlanoDeAcao } from "../components/PlanoDeAcao";
import { Anotacoes } from "../components/Anotacoes";
import { Topbar } from "../components/Topbar";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent, clarityTag } from "../lib/clarity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INFO_OPEN);
    if (saved === "true") setIsInfoOpen(true);
  }, []);

  const toggleInfo = () => {
    setIsInfoOpen((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.INFO_OPEN, String(next));
      trackEvent("toggle_info");
      clarityTag("info_panel", next ? "open" : "closed");
      return next;
    });
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} mobile-compact flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black py-4 sm:py-20 px-0 sm:px-4`}
    >
      <div className="flex flex-col w-full max-w-5xl">
        <Topbar isInfoOpen={isInfoOpen} onToggleInfo={toggleInfo} />

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isInfoOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-5 flex flex-col gap-3 text-sm text-blue-900 dark:text-blue-100">
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">📋</span>
              <div>
                <p className="font-semibold text-base mb-1">O que é o PDI?</p>
                <p className="leading-relaxed">
                  O <strong>Plano de Desenvolvimento Individual (PDI)</strong> é
                  uma ferramenta para mapear suas competências, definir objetivos
                  de carreira e acompanhar ações concretas para o seu
                  crescimento profissional.
                </p>
              </div>
            </div>

            <hr className="border-blue-200 dark:border-blue-800" />

            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-base mb-1">
                  Armazenamento local
                </p>
                <p className="leading-relaxed">
                  Todos os seus dados ficam salvos <strong>apenas neste
                  navegador</strong> (localStorage). Se você limpar o cache,
                  usar outro navegador ou trocar de máquina,{" "}
                  <strong>o histórico será perdido</strong>.
                </p>
                <p className="mt-1 leading-relaxed">
                  Para manter uma cópia segura, utilize o botão{" "}
                  <strong>&quot;Exportar PDI&quot;</strong> no topo da página.
                  Assim, você pode importar seus dados quando precisar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="mobile-compact-main flex w-full flex-col items-center sm:items-start gap-12 bg-white dark:bg-zinc-800 p-4 sm:p-8 shadow-sm mt-4">
        <header className="w-full border-b border-border pb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Plano de Desenvolvimento Individual
          </h1>
          <Titulo initialText="Nome do Colaborador" />
        </header>

        <section className="w-full flex flex-col items-center">
          <ObjetivoCarreira />
        </section>

        <section className="w-full">
          <HabilidadesFundamentais />
        </section>

        <section className="w-full">
          <PlanoDeAcao />
        </section>

        <section className="w-full">
          <Anotacoes />
        </section>
      </main>

        <div className="flex justify-end mt-3">
          <a
            href="https://github.com/FelipeLima91/jornada-pdi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-border hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Repositório no GitHub"
            title="Ver repositório no GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
