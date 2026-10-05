"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./Avisos.module.css";

type TipoAviso = "sucesso" | "erro";

interface AcaoAviso {
  rotulo: string;
  aoClicar: () => void;
}

interface OpcoesAviso {
  tipo?: TipoAviso;
  acao?: AcaoAviso;
}

interface Aviso extends OpcoesAviso {
  mensagem: string;
}

interface ContextoAvisos {
  exibirAviso: (mensagem: string, opcoes?: OpcoesAviso) => void;
  ocultarAviso: () => void;
}

const tempoExibicaoMs = 4500;
const contextoAvisos = createContext<ContextoAvisos | null>(null);

export function ProvedorAvisos({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [visivel, setVisivel] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ocultarAviso = useCallback(() => {
    clearTimeout(temporizador.current);
    setVisivel(false);
  }, []);

  const exibirAviso = useCallback((mensagem: string, opcoes: OpcoesAviso = {}) => {
    clearTimeout(temporizador.current);
    setAviso({ mensagem, ...opcoes });
    setVisivel(true);
    temporizador.current = setTimeout(() => setVisivel(false), tempoExibicaoMs);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const valorContexto = useMemo(() => ({ exibirAviso, ocultarAviso }), [exibirAviso, ocultarAviso]);
  const avisoDeErro = aviso?.tipo === "erro";

  function executarAcao() {
    aviso?.acao?.aoClicar();
    ocultarAviso();
  }

  return (
    <contextoAvisos.Provider value={valorContexto}>
      {children}
      <div
        role={avisoDeErro ? "alert" : "status"}
        aria-live={avisoDeErro ? "assertive" : "polite"}
        className={juntarClasses(styles.aviso, visivel && styles.visivel, aviso?.acao && styles.comAcao)}
      >
        {aviso && (
          <>
            <span aria-hidden="true" className={juntarClasses(styles.icone, avisoDeErro && styles.iconeErro)}>
              {avisoDeErro ? "!" : "✓"}
            </span>
            <span className={styles.mensagem}>{aviso.mensagem}</span>
            {aviso.acao && (
              <button type="button" className={styles.acao} tabIndex={visivel ? 0 : -1} onClick={executarAcao}>
                {aviso.acao.rotulo}
              </button>
            )}
          </>
        )}
      </div>
    </contextoAvisos.Provider>
  );
}

export function useAvisos() {
  const contexto = useContext(contextoAvisos);

  if (!contexto) {
    throw new Error("useAvisos deve ser usado dentro de ProvedorAvisos.");
  }

  return contexto;
}
