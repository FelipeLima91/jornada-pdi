import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ConfirmModal } from "./ui/ConfirmModal";
import { STORAGE_KEYS } from "../lib/constants";
import { trackEvent, clarityTag } from "../lib/clarity";

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

type ListName = "potencializar" | "aprender";

interface TagColumnProps {
  label: string;
  tags: string[];
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRequestRemove: (index: number, value: string) => void;
  toneOffset?: number;
}

function TagColumn({
  label,
  tags,
  inputValue,
  inputRef,
  onInputChange,
  onAdd,
  onKeyDown,
  onRequestRemove,
  toneOffset = 0,
}: TagColumnProps) {
  return (
    <div className="flex flex-col gap-3 border border-border p-5">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className={`group/tag inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border ${getTagTone(i + toneOffset)}`}
          >
            {tag}
            <button
              onClick={() => onRequestRemove(i, tag)}
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
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nova habilidade..."
          className="flex-1 px-3 py-2 text-sm border border-input bg-background outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={onAdd}
          className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Adicionar habilidade"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function HabilidadesFundamentais() {
  const [potencializar, setPotencializar] = useLocalStorage<string[]>(STORAGE_KEYS.HAB_POTENCIALIZAR, []);
  const [aprender, setAprender] = useLocalStorage<string[]>(STORAGE_KEYS.HAB_APRENDER, []);
  const [inputPot, setInputPot] = useState("");
  const [inputApr, setInputApr] = useState("");
  const inputPotRef = useRef<HTMLInputElement>(null);
  const inputAprRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    list: ListName;
    index: number;
    value: string;
  } | null>(null);

  const addTag = (list: ListName) => {
    if (list === "potencializar" && inputPot.trim()) {
      setPotencializar((prev) => [...prev, inputPot.trim()]);
      setInputPot("");
      inputPotRef.current?.focus();
      trackEvent("add_habilidade");
      clarityTag("tipo_habilidade", "potencializar");
    } else if (list === "aprender" && inputApr.trim()) {
      setAprender((prev) => [...prev, inputApr.trim()]);
      setInputApr("");
      inputAprRef.current?.focus();
      trackEvent("add_habilidade");
      clarityTag("tipo_habilidade", "aprender");
    }
  };

  const requestRemove = (list: ListName, index: number, value: string) => {
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
    trackEvent("remove_habilidade");
    clarityTag("tipo_habilidade", list);

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Habilidades fundamentais para o objetivo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TagColumn
          label="Já existem e precisam ser potencializadas"
          tags={potencializar}
          inputValue={inputPot}
          inputRef={inputPotRef}
          onInputChange={setInputPot}
          onAdd={() => addTag("potencializar")}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("potencializar"); } }}
          onRequestRemove={(index, value) => requestRemove("potencializar", index, value)}
        />
        <TagColumn
          label="Preciso aprender antes do próximo passo"
          tags={aprender}
          inputValue={inputApr}
          inputRef={inputAprRef}
          onInputChange={setInputApr}
          onAdd={() => addTag("aprender")}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("aprender"); } }}
          onRequestRemove={(index, value) => requestRemove("aprender", index, value)}
          toneOffset={3}
        />
      </div>

      <ConfirmModal
        open={!!modalOpen && !!pendingRemove}
        title="Confirmar exclusão"
        message={
          <>
            Tem certeza que deseja remover{" "}
            <strong className="text-foreground">
              &quot;{pendingRemove?.value}&quot;
            </strong>
            ?
          </>
        }
        onConfirm={confirmRemove}
        onCancel={() => {
          setModalOpen(false);
          setPendingRemove(null);
        }}
      />
    </div>
  );
}
