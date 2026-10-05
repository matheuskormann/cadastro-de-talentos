"use client";

import { TituloPagina } from "@/components/layout/TituloPagina/TituloPagina";
import { Alerta } from "@/components/ui/Alerta/Alerta";
import { LinkBotao } from "@/components/ui/Botao/LinkBotao";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { rotas } from "@/config/rotas";
import { useCandidato } from "../../hooks/useCandidato";
import { converterDetalheParaFormulario } from "../../utils/conversoesFormulario";
import { FormularioCandidato } from "../FormularioCandidato/FormularioCandidato";
import styles from "./EdicaoCandidato.module.css";

interface PropriedadesEdicaoCandidato {
  candidatoId: string;
}

export function EdicaoCandidato({ candidatoId }: PropriedadesEdicaoCandidato) {
  const { candidato, carregando, erro } = useCandidato(candidatoId);

  if (erro) {
    return (
      <div className={styles.pagina}>
        <Alerta variante="erro">{erro}</Alerta>
        <LinkBotao href={rotas.candidatos} variante="secundario">
          Voltar para a lista
        </LinkBotao>
      </div>
    );
  }

  if (carregando || !candidato) {
    return <IndicadorCarregamento mensagem="Carregando candidato…" />;
  }

  return (
    <div className={styles.pagina}>
      <TituloPagina destaque titulo="Editar candidato." descricao={candidato.nomeCompleto} />
      <FormularioCandidato candidatoId={candidato.id} valoresIniciais={converterDetalheParaFormulario(candidato)} />
    </div>
  );
}
