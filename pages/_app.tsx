import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { initClarity, clarityTag } from "../lib/clarity";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initClarity();
    clarityTag("page", "home");
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster position="bottom-center" richColors closeButton />
    </>
  );
}
