import { useEffect, useState } from "react";
import { Moon, Sun, Download, FileText, Printer, Info, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent, clarityTag } from "../lib/clarity";
import { getPdiData, buildTxtContent } from "../lib/export";

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
    if (wasDark) {
      html.classList.remove("dark");
      const restoreDark = () => {
        html.classList.add("dark");
        window.removeEventListener("afterprint", restoreDark);
      };
      window.addEventListener("afterprint", restoreDark);
    }
    window.print();
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
