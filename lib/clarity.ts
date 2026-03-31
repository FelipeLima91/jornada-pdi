import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "w2mp8v43ig";

let initialized = false;

/** Inicializa o Clarity (chamar apenas uma vez em _app.tsx) */
export function initClarity() {
  if (initialized || typeof window === "undefined") return;
  Clarity.init(CLARITY_PROJECT_ID);
  initialized = true;
}

/** Dispara um evento customizado no Clarity */
export function trackEvent(name: string) {
  if (typeof window === "undefined" || !initialized) return;
  Clarity.event(name);
}

/** Define uma tag customizada (key-value) no Clarity */
export function clarityTag(key: string, value: string) {
  if (typeof window === "undefined" || !initialized) return;
  Clarity.setTag(key, value);
}
