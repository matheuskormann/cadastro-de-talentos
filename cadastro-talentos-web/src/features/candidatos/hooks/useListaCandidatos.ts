"use client";

import { useCallback, useEffect, useState } from "react";
import { ErroApi } from "@/lib/http/ErroApi";
import { listarCandidatos } from "../services/candidatosService";
import type { CandidatoResumo } from "../types/candidato";

export function useListaCandidatos() {
  const [candidatos, setCandidatos] = useState<CandidatoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao((versaoAtual) => versaoAtual + 1), []);

  useEffect(() => {
    let cancelado = false;

    listarCandidatos()
      .then((resultado) => {
        if (!cancelado) {
          setCandidatos(resultado);
          setErro(null);
        }
      })
      .catch((excecao: unknown) => {
        if (!cancelado) {
          setErro(excecao instanceof ErroApi ? excecao.message : "Não foi possível carregar os candidatos.");
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCarregando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [versao]);

  return { candidatos, carregando, erro, recarregar };
}
