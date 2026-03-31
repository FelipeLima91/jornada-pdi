import { format } from "date-fns";
import { STORAGE_KEYS } from "./constants";

function getStorage(key: string) {
  const val = localStorage.getItem(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

export function getPdiData() {
  return {
    titulo: getStorage(STORAGE_KEYS.TITULO) || "Meu Plano de Desenvolvimento",
    objetivo: getStorage(STORAGE_KEYS.OBJETIVO) || "Não preenchido",
    pot: (getStorage(STORAGE_KEYS.HAB_POTENCIALIZAR) || []) as string[],
    apr: (getStorage(STORAGE_KEYS.HAB_APRENDER) || []) as string[],
    planoDocs: (getStorage(STORAGE_KEYS.PLANO_ACAO) || []) as {
      acao?: string;
      estimativa?: string;
      indicador?: string;
    }[],
    anotacoes: getStorage(STORAGE_KEYS.ANOTACOES) || "Nenhuma anotação",
  };
}

export function buildTxtContent(data: ReturnType<typeof getPdiData>) {
  const { titulo, objetivo, pot, apr, planoDocs, anotacoes } = data;

  const potLines =
    pot.length === 0
      ? ["- Nenhuma habilidade cadastrada."]
      : pot.map((h) => `- ${h}`);

  const aprLines =
    apr.length === 0
      ? ["- Nenhuma habilidade cadastrada."]
      : apr.map((h) => `- ${h}`);

  const planoLines =
    planoDocs.length === 0
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
