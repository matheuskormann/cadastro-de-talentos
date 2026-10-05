"use client";

import { useCallback, useEffect, useState } from "react";
import { ErroApi } from "@/lib/http/ErroApi";
import { obterCandidato } from "../services/candidatosService";
import type { CandidatoDetalhe } from "../types/candidato";

interface EstadoCandidato {
  idCarregado: string | null;
  candidato: CandidatoDetalhe | null;
  erro: string | null;
}

const estadoInicial: EstadoCandidato = { idCarregado: null, candidato: null, erro: null };

export function useCandidato(id: string | null) {
  const [estado, setEstado] = useState<EstadoCandidato>(estadoInicial);
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao((versaoAtual) => versaoAtual + 1), []);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelado = false;

    obterCandidato(id)
      .then((candidato) => {
        if (!cancelado) {
          setEstado({ idCarregado: id, candidato, erro: null });
        }
      })
      .catch((excecao: unknown) => {
        if (!cancelado) {
          const mensagem = excecao instanceof ErroApi ? excecao.message : "Não foi possível carregar o candidato.";
          setEstado({ idCarregado: id, candidato: null, erro: mensagem });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [id, versao]);

  const carregado = estado.idCarregado === id;

  return {
    candidato: carregado ? estado.candidato : null,
    ultimoCandidato: estado.candidato,
    carregando: Boolean(id) && !carregado,
    erro: carregado ? estado.erro : null,
    recarregar,
  };
}
