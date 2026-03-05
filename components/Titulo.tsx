import React, { useState, useRef, useEffect } from "react";
import { Pen } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface TituloProps {
  initialText?: string;
  storageKey?: string;
  className?: string;
}

export function Titulo({
  initialText = "Meu Plano de Desenvolvimento",
  storageKey = "pdi-titulo",
  className = "",
}: TituloProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useLocalStorage(storageKey, initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (!text.trim()) {
      setText(initialText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setText(initialText);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group relative inline-flex items-center gap-2 ${className}`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-lg font-medium bg-transparent border-b-2 border-primary outline-none min-w-[250px] text-zinc-600 dark:text-zinc-300 transition-all"
        />
      ) : (
        <h2
          className="text-lg font-medium cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {text}
        </h2>
      )}

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-primary rounded-md"
          aria-label="Editar Título"
        >
          <Pen size={18} />
        </button>
      )}
    </div>
  );
}
