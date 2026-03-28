import { useState } from "react";
import { ChevronDown, Pen } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent } from "../lib/clarity";

export function Anotacoes() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useLocalStorage(STORAGE_KEYS.ANOTACOES, "");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col w-full border border-border">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Anotações
        </h3>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Accordion Content */}
      {open && (
        <div className="px-5 pb-5 group">
          {isEditing ? (
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => { setIsEditing(false); trackEvent("edit_anotacoes"); }}
              placeholder="Escreva suas anotações aqui..."
              className="w-full min-h-[200px] p-4 text-sm leading-relaxed bg-background border border-input outline-none focus:border-primary transition-colors resize-y placeholder:text-muted-foreground"
            />
          ) : (
            <div
              className="relative w-full min-h-[200px] p-4 text-sm leading-relaxed border border-border cursor-pointer hover:border-primary/50 transition-colors whitespace-pre-wrap"
              onClick={() => setIsEditing(true)}
            >
              {text || (
                <span className="text-muted-foreground italic">
                  Clique para adicionar anotações...
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="absolute top-3 right-3 p-2 text-zinc-400 hover:text-primary bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Editar anotações"
                title="Editar"
              >
                <Pen size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
