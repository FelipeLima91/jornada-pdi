import { Geist, Geist_Mono } from "next/font/google";
import { Titulo } from "../components/Titulo";
import { ObjetivoCarreira } from "../components/ObjetivoCarreira";
import { HabilidadesFundamentais } from "../components/HabilidadesFundamentais";
import { PlanoDeAcao } from "../components/PlanoDeAcao";
import { Anotacoes } from "../components/Anotacoes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black py-20 px-4`}
    >
      <main className="flex w-full max-w-4xl flex-col items-center sm:items-start gap-12 bg-white dark:bg-zinc-950 p-8 shadow-sm">
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
    </div>
  );
}

