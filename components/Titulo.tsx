import { useState, useRef, useEffect } from "react";
import { Pen } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../lib/constants";

interface TituloProps {
  initialText?: string;
}

export function Titulo({
  initialText = "Meu Plano de Desenvolvimento",
}: TituloProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useLocalStorage(STORAGE_KEYS.TITULO, initialText);
  const [textBeforeEdit, setTextBeforeEdit] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setTextBeforeEdit(text);
    setIsEditing(true);
  };

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
      setText(textBeforeEdit);
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative inline-flex items-center gap-2">
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
          onClick={startEditing}
        >
          {text}
        </h2>
      )}

      {!isEditing && (
        <button
          onClick={startEditing}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-primary rounded-md"
          aria-label="Editar Título"
        >
          <Pen size={18} />
        </button>
      )}
    </div>
  );
}
