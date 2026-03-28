import { useEffect, useState } from "react";
import { Moon, Sun, Download, FileText, Printer, Info, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent, clarityTag } from "../lib/clarity";

function getPdiData() {
  const getStorage = (key: string) => {
    const val = localStorage.getItem(key);
    if (!val) return null;
    try { return JSON.parse(val); }
    catch { return val; }
  };

  return {
    titulo: getStorage(STORAGE_KEYS.TITULO) || "Meu Plano de Desenvolvimento",
    objetivo: getStorage(STORAGE_KEYS.OBJETIVO) || "Não preenchido",
    pot: (getStorage(STORAGE_KEYS.HAB_POTENCIALIZAR) || []) as string[],
    apr: (getStorage(STORAGE_KEYS.HAB_APRENDER) || []) as string[],
    planoDocs: (getStorage(STORAGE_KEYS.PLANO_ACAO) || []) as { acao?: string; estimativa?: string; indicador?: string }[],
    anotacoes: getStorage(STORAGE_KEYS.ANOTACOES) || "Nenhuma anotação",
  };
}

function buildTxtContent(data: ReturnType<typeof getPdiData>) {
  const { titulo, objetivo, pot, apr, planoDocs, anotacoes } = data;

  const potLines = pot.length === 0
    ? ["- Nenhuma habilidade cadastrada."]
    : pot.map((h) => `- ${h}`);

  const aprLines = apr.length === 0
    ? ["- Nenhuma habilidade cadastrada."]
    : apr.map((h) => `- ${h}`);

  const planoLines = planoDocs.length === 0
    ? ["Nenhum plano de ação cadastrado.", ""]
    : planoDocs.flatMap((linha, idx) => {
        const dataFmt = linha.estimativa
          ? format(new Date(linha.estimativa + "T00:00:00"), "dd/MM/yyyy")
          : "Sem prazo";
        return [
          `Ação ${idx + 1}: ${linha.acao || "Sem ação descrita"}`,
          `Prazo: ${dataFmt}`,
          `Indicador de Sucesso: ${linha.indicador || "-"}`,
          "",
        ];
      });

  const lines = [
    "=================================================",
    "       PLANO DE DESENVOLVIMENTO INDIVIDUAL",
    "=================================================",
    "",
    "NOME / TÍTULO:",
    titulo,
    "",
    "-------------------------------------------------",
    "OBJETIVO DE CARREIRA:",
    objetivo,
    "",
    "-------------------------------------------------",
    "HABILIDADES A POTENCIALIZAR (Já Existem):",
    ...potLines,
    "",
    "HABILIDADES A APRENDER (Próximo Passo):",
    ...aprLines,
    "",
    "-------------------------------------------------",
    "PLANO DE AÇÃO:",
    "",
    ...planoLines,
    "-------------------------------------------------",
    "ANOTAÇÕES LIVRES:",
    anotacoes,
    "",
    "=================================================",
    `Exportado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`,
  ];

  return lines.join("\n");
}

interface TopbarProps {
  isInfoOpen: boolean;
  onToggleInfo: () => void;
}

export function Topbar({ isInfoOpen, onToggleInfo }: TopbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else if (saved === "light") {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      } else {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem(STORAGE_KEYS.THEME, "light");
      setIsDark(false);
      clarityTag("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem(STORAGE_KEYS.THEME, "dark");
      setIsDark(true);
      clarityTag("theme", "dark");
    }
    trackEvent("toggle_theme");
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
      link.click();
      URL.revokeObjectURL(url);
      setPopoverOpen(false);
      toast.success("PDI exportado em TXT!");
      trackEvent("export_txt");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar TXT.");
    }
  };

  const exportPDF = () => {
    setPopoverOpen(false);
    trackEvent("export_pdf");
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    if (wasDark) html.classList.remove("dark");

    requestAnimationFrame(() => {
      window.print();
      if (wasDark) html.classList.add("dark");
    });
  };

  return (
    <div className="w-full flex justify-end gap-3" data-print-hide>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium",
              "bg-amber-100 text-amber-900 border border-amber-200",
              "hover:bg-amber-200 hover:border-amber-300",
              "dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/50",
              "transition-colors"
            )}
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
        onClick={onToggleInfo}
        className={cn(
          "flex items-center gap-1 px-2 py-2",
          "text-zinc-600 dark:text-zinc-300",
          "bg-zinc-100 dark:bg-zinc-800 border border-border",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          "transition-colors"
        )}
        aria-label={isInfoOpen ? "Ocultar informações" : "Mostrar informações"}
        title={isInfoOpen ? "Ocultar informações" : "Mostrar informações"}
      >
        <Info size={16} />
        {isInfoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <button
        onClick={toggleTheme}
        className={cn(
          "flex items-center justify-center p-2",
          "text-zinc-600 dark:text-zinc-300",
          "bg-zinc-100 dark:bg-zinc-800 border border-border",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          "transition-colors"
        )}
        aria-label="Alternar Tema Claro/Escuro"
        title="Alternar Tema"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
