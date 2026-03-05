import React, { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useLocalStorage";

const amberTones = [
  "bg-amber-200 border-amber-300 text-amber-900",
  "bg-amber-300 border-amber-400 text-amber-950",
  "bg-yellow-200 border-yellow-300 text-yellow-900",
  "bg-yellow-300 border-yellow-400 text-yellow-950",
  "bg-amber-100 border-amber-200 text-amber-800",
  "bg-orange-200 border-orange-300 text-orange-900",
];

function getTagTone(index: number) {
  return amberTones[index % amberTones.length];
}

export function HabilidadesFundamentais() {
  const [potencializar, setPotencializar] = useLocalStorage<string[]>("pdi-hab-potencializar", []);
  const [aprender, setAprender] = useLocalStorage<string[]>("pdi-hab-aprender", []);
  const [inputPot, setInputPot] = useState("");
  const [inputApr, setInputApr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    list: "potencializar" | "aprender";
    index: number;
    value: string;
  } | null>(null);
  const inputPotRef = useRef<HTMLInputElement>(null);
  const inputAprRef = useRef<HTMLInputElement>(null);

  const addTag = (list: "potencializar" | "aprender") => {
    if (list === "potencializar" && inputPot.trim()) {
      setPotencializar((prev) => [...prev, inputPot.trim()]);
      setInputPot("");
      inputPotRef.current?.focus();
    }
    if (list === "aprender" && inputApr.trim()) {
      setAprender((prev) => [...prev, inputApr.trim()]);
      setInputApr("");
      inputAprRef.current?.focus();
    }
  };

  const requestRemove = (
    list: "potencializar" | "aprender",
    index: number,
    value: string
  ) => {
    setPendingRemove({ list, index, value });
    setModalOpen(true);
  };

  const confirmRemove = () => {
    if (!pendingRemove) return;

    const { list, index, value } = pendingRemove;
    const setter = list === "potencializar" ? setPotencializar : setAprender;

    setter((prev) => prev.filter((_, i) => i !== index));
    setModalOpen(false);
    setPendingRemove(null);

    toast.success(`"${value}" removido`, {
      action: {
        label: "Desfazer",
        onClick: () => {
          setter((prev) => {
            const copy = [...prev];
            copy.splice(index, 0, value);
            return copy;
          });
        },
      },
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    list: "potencializar" | "aprender"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(list);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Habilidades fundamentais para o objetivo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="flex flex-col gap-3 border border-border p-5">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Já existem e precisam ser potencializadas
          </span>

          {/* Tags ACIMA do input */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {potencializar.map((tag, i) => (
              <span
                key={`pot-${i}`}
                className={`group/tag inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border ${getTagTone(i)}`}
              >
                {tag}
                <button
                  onClick={() => requestRemove("potencializar", i, tag)}
                  className="opacity-0 group-hover/tag:opacity-100 hover:text-destructive transition-all ml-1"
                  aria-label={`Remover ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              ref={inputPotRef}
              value={inputPot}
              onChange={(e) => setInputPot(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "potencializar")}
              placeholder="Nova habilidade..."
              className="flex-1 px-3 py-2 text-sm border border-input bg-background outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={() => addTag("potencializar")}
              className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Adicionar habilidade"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="flex flex-col gap-3 border border-border p-5">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Preciso aprender antes do próximo passo
          </span>

          {/* Tags ACIMA do input */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {aprender.map((tag, i) => (
              <span
                key={`apr-${i}`}
                className={`group/tag inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border ${getTagTone(i + 3)}`}
              >
                {tag}
                <button
                  onClick={() => requestRemove("aprender", i, tag)}
                  className="opacity-0 group-hover/tag:opacity-100 hover:text-destructive transition-all ml-1"
                  aria-label={`Remover ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              ref={inputAprRef}
              value={inputApr}
              onChange={(e) => setInputApr(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "aprender")}
              placeholder="Nova habilidade..."
              className="flex-1 px-3 py-2 text-sm border border-input bg-background outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={() => addTag("aprender")}
              className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Adicionar habilidade"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {modalOpen && pendingRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card text-card-foreground border border-border p-6 shadow-lg w-full max-w-sm flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Confirmar exclusão</h4>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover{" "}
              <strong className="text-foreground">
                &quot;{pendingRemove.value}&quot;
              </strong>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setPendingRemove(null);
                }}
                className="px-4 py-2 text-sm border border-border hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 text-sm bg-destructive text-white hover:bg-destructive/90 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
