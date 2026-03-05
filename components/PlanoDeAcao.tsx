import React, { useState } from "react";
import { Pen, Trash2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DatePicker } from "./ui/date-picker";

interface Linha {
  id: number;
  acao: string;
  estimativa: string;
  indicador: string;
}

let nextId = 1;

export function PlanoDeAcao() {
  const [linhas, setLinhas] = useLocalStorage<Linha[]>("pdi-plano-acao", []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Omit<Linha, "id">>({
    acao: "",
    estimativa: "",
    indicador: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    id: number;
    linha: Linha;
    index: number;
  } | null>(null);

  // Sync nextId with existing data
  if (linhas.length > 0) {
    const maxId = Math.max(...linhas.map((l) => l.id));
    if (maxId >= nextId) nextId = maxId + 1;
  }

  const addLinha = () => {
    const nova: Linha = {
      id: nextId++,
      acao: "",
      estimativa: "",
      indicador: "",
    };
    setLinhas((prev) => [...prev, nova]);
    setEditingId(nova.id);
    setEditDraft({ acao: "", estimativa: "", indicador: "" });
  };

  const startEdit = (linha: Linha) => {
    setEditingId(linha.id);
    setEditDraft({
      acao: linha.acao,
      estimativa: linha.estimativa,
      indicador: linha.indicador,
    });
  };

  const saveEdit = () => {
    if (editingId === null) return;
    setLinhas((prev) =>
      prev.map((l) =>
        l.id === editingId
          ? { ...l, acao: editDraft.acao, estimativa: editDraft.estimativa, indicador: editDraft.indicador }
          : l
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    const linha = linhas.find((l) => l.id === editingId);
    if (linha && !linha.acao && !linha.estimativa && !linha.indicador) {
      setLinhas((prev) => prev.filter((l) => l.id !== editingId));
    }
    setEditingId(null);
  };

  const requestRemove = (id: number) => {
    const index = linhas.findIndex((l) => l.id === id);
    const linha = linhas[index];
    if (!linha) return;
    setPendingRemove({ id, linha, index });
    setModalOpen(true);
  };

  const confirmRemove = () => {
    if (!pendingRemove) return;
    const { id, linha, index } = pendingRemove;

    setLinhas((prev) => prev.filter((l) => l.id !== id));
    setEditingId(null);
    setModalOpen(false);
    setPendingRemove(null);

    toast.success(`Plano "${linha.acao || "sem título"}" removido`, {
      action: {
        label: "Desfazer",
        onClick: () => {
          setLinhas((prev) => {
            const copy = [...prev];
            copy.splice(index, 0, linha);
            return copy;
          });
        },
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Plano de Ação
      </h3>

      <div className="w-full overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground border-b border-r border-border w-[40%]">
                Plano de ação
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground border-b border-r border-border w-[25%]">
                Prazo
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground border-b border-r border-border w-[30%]">
                Como sei que me desenvolvi
              </th>
              <th className="px-2 py-3 border-b border-border w-[5%]" />
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum plano de ação adicionado. Clique em &quot;+ Adicionar
                  linha&quot; para começar.
                </td>
              </tr>
            )}
            {linhas.map((linha) => (
              <tr
                key={linha.id}
                className="group border-b border-border hover:bg-muted/30 transition-colors"
              >
                {editingId === linha.id ? (
                  <>
                    <td className="px-3 py-2 border-r border-border">
                      <input
                        autoFocus
                        value={editDraft.acao}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, acao: e.target.value }))
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Descreva o plano..."
                        className="w-full px-2 py-1.5 text-sm bg-background border border-input outline-none focus:border-primary transition-colors"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-border">
                      <DatePicker
                        value={editDraft.estimativa}
                        onChange={(val) =>
                          setEditDraft((d) => ({ ...d, estimativa: val }))
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-border">
                      <input
                        value={editDraft.indicador}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            indicador: e.target.value,
                          }))
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Indicador de sucesso..."
                        className="w-full px-2 py-1.5 text-sm bg-background border border-input outline-none focus:border-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={saveEdit}
                          className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          aria-label="Salvar"
                          title="Salvar"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => requestRemove(linha.id)}
                          className="p-1.5 text-destructive hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          aria-label="Remover linha"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                          aria-label="Cancelar"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 border-r border-border">
                      {linha.acao || (
                        <span className="text-muted-foreground italic">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      {linha.estimativa
                        ? format(new Date(linha.estimativa + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
                        : (
                          <span className="text-muted-foreground italic">
                            —
                          </span>
                        )}
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      {linha.indicador || (
                        <span className="text-muted-foreground italic">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => startEdit(linha)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                        aria-label="Editar linha"
                        title="Editar"
                      >
                        <Pen size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addLinha}
        className="self-start inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
      >
        <Plus size={16} />
        Adicionar linha
      </button>

      {/* Modal de Confirmação */}
      {modalOpen && pendingRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card text-card-foreground border border-border p-6 shadow-lg w-full max-w-sm flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Confirmar exclusão</h4>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover o plano{" "}
              <strong className="text-foreground">
                &quot;{pendingRemove.linha.acao || "sem título"}&quot;
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
