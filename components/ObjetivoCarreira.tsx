import { useState, useRef, useEffect } from "react";
import { Pen } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent } from "../lib/clarity";

const DEFAULT_TEXT = "Escreva aqui seu objetivo para este ciclo...";

export function ObjetivoCarreira() {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useLocalStorage(STORAGE_KEYS.OBJETIVO, DEFAULT_TEXT);
  const [textBeforeEdit, setTextBeforeEdit] = useState(DEFAULT_TEXT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const startEditing = () => {
    setTextBeforeEdit(text);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!text.trim()) {
      setText(DEFAULT_TEXT);
    } else {
      trackEvent("edit_objetivo");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setText(textBeforeEdit);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-0 w-full max-w-2xl">
      {/* Label acima do card */}
      <div className="bg-primary px-5 py-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
          Objetivo de carreira para o próximo ciclo
        </span>
      </div>

      {/* Card em destaque amber */}
      <div 
        className="group relative w-full border-2 border-primary bg-primary/10 p-6 min-h-[120px] transition-all hover:bg-primary/15 hover:shadow-md"
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full min-h-[80px] bg-transparent resize-none outline-none text-base leading-relaxed text-zinc-900 dark:text-zinc-50 placeholder:text-primary/50"
            placeholder="Digite seu objetivo..."
          />
        ) : (
          <div 
            className="w-full h-full text-base leading-relaxed cursor-pointer pr-10 whitespace-pre-wrap text-zinc-900 dark:text-zinc-50"
            onClick={startEditing}
          >
            {text}
          </div>
        )}

        {!isEditing && (
          <button 
            onClick={startEditing}
            className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors p-2 bg-primary/20 hover:bg-primary/30 opacity-0 group-hover:opacity-100"
            aria-label="Editar Objetivo"
            title="Editar"
          >
            <Pen size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
