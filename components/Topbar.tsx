import React, { useEffect, useState } from "react";
import { Moon, Sun, Download, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function getPdiData() {
  const getStorage = (key: string) => {
    const val = localStorage.getItem(key);
    if (!val) return null;
    try { return JSON.parse(val); }
    catch { return val; }
  };

  return {
    titulo: getStorage("pdi-titulo") || "Meu Plano de Desenvolvimento",
    objetivo: getStorage("pdi-objetivo") || "Não preenchido",
    pot: (getStorage("pdi-hab-potencializar") || []) as string[],
    apr: (getStorage("pdi-hab-aprender") || []) as string[],
    planoDocs: (getStorage("pdi-plano-acao") || []) as { acao?: string; estimativa?: string; indicador?: string }[],
    anotacoes: getStorage("pdi-anotacoes") || "Nenhuma anotação",
  };
}

function buildTxtContent(data: ReturnType<typeof getPdiData>) {
  const { titulo, objetivo, pot, apr, planoDocs, anotacoes } = data;
  let txt = `=================================================\n`;
  txt += `       PLANO DE DESENVOLVIMENTO INDIVIDUAL\n`;
  txt += `=================================================\n\n`;
  txt += `NOME / TÍTULO:\n${titulo}\n\n`;
  txt += `-------------------------------------------------\n`;
  txt += `OBJETIVO DE CARREIRA:\n${objetivo}\n\n`;
  txt += `-------------------------------------------------\n`;

  txt += `HABILIDADES A POTENCIALIZAR (Já Existem):\n`;
  if (pot.length === 0) txt += `- Nenhuma habilidade cadastrada.\n`;
  pot.forEach((h) => txt += `- ${h}\n`);
  txt += `\n`;

  txt += `HABILIDADES A APRENDER (Próximo Passo):\n`;
  if (apr.length === 0) txt += `- Nenhuma habilidade cadastrada.\n`;
  apr.forEach((h) => txt += `- ${h}\n`);
  txt += `\n`;

  txt += `-------------------------------------------------\n`;
  txt += `PLANO DE AÇÃO:\n\n`;
  if (planoDocs.length === 0) {
    txt += `Nenhum plano de ação cadastrado.\n\n`;
  } else {
    planoDocs.forEach((linha, idx) => {
      txt += `Ação ${idx + 1}: ${linha.acao || "Sem ação descrita"}\n`;
      const dataFmt = linha.estimativa ? format(new Date(linha.estimativa + "T00:00:00"), "dd/MM/yyyy") : "Sem prazo";
      txt += `Prazo: ${dataFmt}\n`;
      txt += `Indicador de Sucesso: ${linha.indicador || "-"}\n\n`;
    });
  }

  txt += `-------------------------------------------------\n`;
  txt += `ANOTAÇÕES LIVRES:\n${anotacoes}\n\n`;
  txt += `=================================================\n`;
  txt += `Exportado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}\n`;

  return txt;
}

export function Topbar() {
  const [isDark, setIsDark] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const exportTXT = () => {
    try {
      const data = getPdiData();
      const txtContent = buildTxtContent(data);
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PDI_${data.titulo.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setPopoverOpen(false);
      toast.success("PDI exportado em TXT!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar TXT.");
    }
  };

  const exportPDF = () => {
    setPopoverOpen(false);
    // Usa o próprio layout da página + CSS @media print
    window.print();
  };

  return (
    <div className="w-full flex justify-end gap-3" data-print-hide>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200 hover:border-amber-300 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/50 transition-colors"
            aria-label="Exportar PDI"
          >
            <Download size={16} />
            Exportar PDI
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 flex flex-col gap-1" align="end">
          <button
            onClick={exportTXT}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
          >
            <FileText size={16} className="text-muted-foreground" />
            Salvar como texto
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
          >
            <Printer size={16} className="text-red-500 dark:text-red-400" />
            Salvar como PDF
          </button>
        </PopoverContent>
      </Popover>

      <button
        onClick={toggleTheme}
        className="flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-border hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Alternar Tema Claro/Escuro"
        title="Alternar Tema"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
