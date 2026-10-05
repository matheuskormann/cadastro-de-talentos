"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Botao } from "../Botao/Botao";
import styles from "./ModalConfirmacao.module.css";

interface PropriedadesModalConfirmacao {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  rotuloConfirmar?: string;
  rotuloCancelar?: string;
  perigoso?: boolean;
  carregando?: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

const seletorFocavel = "button:not(:disabled)";

export function ModalConfirmacao({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar = "Confirmar",
  rotuloCancelar = "Cancelar",
  perigoso = false,
  carregando = false,
  aoConfirmar,
  aoCancelar,
}: PropriedadesModalConfirmacao) {
  const idTitulo = useId();
  const idDescricao = useId();
  const referenciaModal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    const elementoAnterior = document.activeElement as HTMLElement | null;
    const rolagemAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    referenciaModal.current?.querySelector<HTMLElement>(seletorFocavel)?.focus();

    return () => {
      document.body.style.overflow = rolagemAnterior;
      elementoAnterior?.focus();
    };
  }, [aberto]);

  if (!aberto) {
    return null;
  }

  function tratarTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape" && !carregando) {
      aoCancelar();
      return;
    }

    if (evento.key !== "Tab") {
      return;
    }

    const focaveis = Array.from(referenciaModal.current?.querySelectorAll<HTMLElement>(seletorFocavel) ?? []);
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo?.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro?.focus();
    }
  }

  return createPortal(
    <div className={styles.sobreposicao} onClick={carregando ? undefined : aoCancelar}>
      <div
        ref={referenciaModal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descricao ? idDescricao : undefined}
        className={styles.modal}
        onClick={(evento) => evento.stopPropagation()}
        onKeyDown={tratarTeclado}
      >
        <div className={styles.textos}>
          <h2 id={idTitulo} className={styles.titulo}>
            {titulo}
          </h2>
          {descricao && (
            <p id={idDescricao} className={styles.descricao}>
              {descricao}
            </p>
          )}
        </div>
        <div className={styles.acoes}>
          <Botao variante="secundario" onClick={aoCancelar} disabled={carregando}>
            {rotuloCancelar}
          </Botao>
          <Botao variante={perigoso ? "perigoSolido" : "primario"} onClick={aoConfirmar} carregando={carregando}>
            {rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </div>,
    document.body,
  );
}
