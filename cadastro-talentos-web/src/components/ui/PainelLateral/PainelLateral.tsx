"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./PainelLateral.module.css";

interface PropriedadesPainelLateral {
  aberto: boolean;
  rotuloAcessivel: string;
  aoFechar: () => void;
  children: ReactNode;
}

export function PainelLateral({ aberto, rotuloAcessivel, aoFechar, children }: PropriedadesPainelLateral) {
  const referenciaPainel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function fecharComEsc(evento: KeyboardEvent) {
      const modalAberto = document.querySelector("[role='alertdialog']");

      if (evento.key === "Escape" && !modalAberto) {
        aoFechar();
      }
    }

    const rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", fecharComEsc);
    referenciaPainel.current?.focus();

    return () => {
      document.body.style.overflow = rolagemAnterior;
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [aberto, aoFechar]);

  return (
    <>
      <div aria-hidden="true" className={juntarClasses(styles.sobreposicao, aberto && styles.sobreposicaoVisivel)} onClick={aoFechar} />
      <aside
        ref={referenciaPainel}
        role="dialog"
        aria-modal="true"
        aria-label={rotuloAcessivel}
        aria-hidden={!aberto}
        tabIndex={-1}
        className={juntarClasses(styles.painel, aberto && styles.painelAberto)}
      >
        <div className={styles.conteudo}>
          <div className={styles.barraSuperior}>
            <button type="button" className={styles.fechar} aria-label="Fechar" onClick={aoFechar}>
              ×
            </button>
          </div>
          {children}
        </div>
      </aside>
    </>
  );
}
