"use client";

import { useState } from "react";
import { useAvisos } from "@/components/ui/Avisos/ProvedorAvisos";
import { Botao } from "@/components/ui/Botao/Botao";
import { AreaTexto } from "@/components/ui/Campo/AreaTexto";
import { EscalaNota } from "@/components/ui/EscalaNota/EscalaNota";
import { ErroApi } from "@/lib/http/ErroApi";
import { salvarAvaliacao } from "../../services/candidatosService";
import type { Avaliacao } from "../../types/avaliacao";
import { criteriosNotas, rotulosCriterio } from "../../utils/avaliacao";
import styles from "./PainelCandidato.module.css";

type NotasAvaliacao = Record<(typeof criteriosNotas)[number], number | null>;

interface PropriedadesFormularioAvaliacao {
  candidatoId: string;
  avaliacaoAtual: Avaliacao | null;
  aoSalvar: () => void;
  aoCancelar: () => void;
}

const tamanhoMaximoComentario = 2000;

export function FormularioAvaliacao({ candidatoId, avaliacaoAtual, aoSalvar, aoCancelar }: PropriedadesFormularioAvaliacao) {
  const { exibirAviso } = useAvisos();
  const [notas, setNotas] = useState<NotasAvaliacao>({
    notaExperiencia: avaliacaoAtual?.notaExperiencia ?? null,
    notaFormacao: avaliacaoAtual?.notaFormacao ?? null,
    notaComunicacao: avaliacaoAtual?.notaComunicacao ?? null,
  });
  const [comentario, setComentario] = useState(avaliacaoAtual?.comentario ?? "");
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const comentarioLongo = comentario.length > tamanhoMaximoComentario;

  async function salvar() {
    setTentouSalvar(true);

    const { notaExperiencia, notaFormacao, notaComunicacao } = notas;

    if (notaExperiencia === null || notaFormacao === null || notaComunicacao === null || comentarioLongo) {
      return;
    }

    setSalvando(true);

    try {
      await salvarAvaliacao(candidatoId, {
        notaExperiencia,
        notaFormacao,
        notaComunicacao,
        comentario: comentario.trim() || null,
        sugeridaPorIa: false,
      });

      exibirAviso("Avaliação salva");
      aoSalvar();
    } catch (excecao) {
      exibirAviso(excecao instanceof ErroApi ? excecao.message : "Não foi possível salvar a avaliação.", { tipo: "erro" });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={styles.avaliacao}>
      {criteriosNotas.map((criterio) => (
        <EscalaNota
          key={criterio}
          rotulo={rotulosCriterio[criterio]}
          valor={notas[criterio]}
          erro={tentouSalvar && notas[criterio] === null ? "Selecione uma nota de 0 a 10." : undefined}
          aoAlterar={(nota) => setNotas((notasAtuais) => ({ ...notasAtuais, [criterio]: nota }))}
        />
      ))}
      <AreaTexto
        rotulo="Comentário"
        rows={3}
        value={comentario}
        erro={comentarioLongo ? `O comentário deve ter no máximo ${tamanhoMaximoComentario} caracteres.` : undefined}
        onChange={(evento) => setComentario(evento.target.value)}
      />
      <div className={styles.rodape}>
        <Botao variante="texto" tamanho="pequeno" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </Botao>
        <Botao tamanho="pequeno" carregando={salvando} onClick={salvar}>
          Salvar avaliação
        </Botao>
      </div>
    </div>
  );
}
