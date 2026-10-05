"use client";

import { useState } from "react";
import { Alerta } from "@/components/ui/Alerta/Alerta";
import { useAvisos } from "@/components/ui/Avisos/ProvedorAvisos";
import { Botao } from "@/components/ui/Botao/Botao";
import { LinkBotao } from "@/components/ui/Botao/LinkBotao";
import { Etiqueta } from "@/components/ui/Etiqueta/Etiqueta";
import { IconeCopiar, IconeEmail, IconeTelefone } from "@/components/ui/Icones/Icones";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { ModalConfirmacao } from "@/components/ui/ModalConfirmacao/ModalConfirmacao";
import { PainelLateral } from "@/components/ui/PainelLateral/PainelLateral";
import { rotas } from "@/config/rotas";
import { juntarClasses } from "@/lib/classes";
import { ErroApi } from "@/lib/http/ErroApi";
import { rotulosNivelCompetencia, rotulosNivelFormacao, rotulosOrigemCadastro, rotulosTipoCompetencia } from "../../constants/opcoes";
import { useCandidato } from "../../hooks/useCandidato";
import { obterUrlCurriculo, removerCandidato } from "../../services/candidatosService";
import type { CandidatoDetalhe, TipoCompetencia } from "../../types/candidato";
import { criteriosNotas, rotulosCriterio } from "../../utils/avaliacao";
import {
  formatarData,
  formatarIdade,
  formatarLocalizacao,
  formatarNascimento,
  formatarNota,
  formatarPeriodo,
  formatarTelefone,
  obterPrimeiroNome,
} from "../../utils/formatacao";
import { BarraNota } from "../BarraNota/BarraNota";
import { FormularioAvaliacao } from "./FormularioAvaliacao";
import styles from "./PainelCandidato.module.css";

interface PropriedadesPainelCandidato {
  candidatoId: string | null;
  aoFechar: () => void;
  aoAlterarCandidato: () => void;
}

const ordemTiposCompetencia: TipoCompetencia[] = ["Tecnica", "Comportamental", "Idioma"];

export function PainelCandidato({ candidatoId, aoFechar, aoAlterarCandidato }: PropriedadesPainelCandidato) {
  const { candidato, ultimoCandidato, carregando, erro, recarregar } = useCandidato(candidatoId);
  const candidatoExibido = candidato ?? (candidatoId ? null : ultimoCandidato);

  return (
    <PainelLateral aberto={Boolean(candidatoId)} rotuloAcessivel="Ficha do candidato" aoFechar={aoFechar}>
      {carregando && <IndicadorCarregamento mensagem="Carregando ficha…" />}
      {erro && <Alerta variante="erro">{erro}</Alerta>}
      {candidatoExibido && (
        <FichaCandidato
          key={candidatoExibido.id}
          candidato={candidatoExibido}
          aoAlterar={() => {
            recarregar();
            aoAlterarCandidato();
          }}
          aoExcluir={() => {
            aoFechar();
            aoAlterarCandidato();
          }}
        />
      )}
    </PainelLateral>
  );
}

interface PropriedadesFichaCandidato {
  candidato: CandidatoDetalhe;
  aoAlterar: () => void;
  aoExcluir: () => void;
}

function FichaCandidato({ candidato, aoAlterar, aoExcluir }: PropriedadesFichaCandidato) {
  const { exibirAviso } = useAvisos();
  const { avaliacao } = candidato;
  const [editandoAvaliacao, setEditandoAvaliacao] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const subtitulo = [formatarLocalizacao(candidato.cidade, candidato.estado), formatarIdade(candidato.idade, candidato.dataNascimentoEstimada)]
    .filter(Boolean)
    .join(" · ");

  const informacoes = [
    { rotulo: "E-mail", valor: candidato.email },
    { rotulo: "Telefone", valor: candidato.telefone ? formatarTelefone(candidato.telefone) : "—" },
    { rotulo: "Nascimento", valor: formatarNascimento(candidato.dataNascimento, candidato.dataNascimentoEstimada) },
    { rotulo: "Cidade", valor: formatarLocalizacao(candidato.cidade, candidato.estado) ?? "—" },
    { rotulo: "Cadastrado em", valor: formatarData(candidato.dataCadastro) },
    { rotulo: "Origem", valor: rotulosOrigemCadastro[candidato.origemCadastro] },
  ];

  const gruposCompetencias = ordemTiposCompetencia
    .map((tipo) => ({ tipo, competencias: candidato.competencias.filter((competencia) => competencia.tipo === tipo) }))
    .filter((grupo) => grupo.competencias.length > 0);

  async function copiarEmail() {
    try {
      await navigator.clipboard.writeText(candidato.email);
      exibirAviso("E-mail copiado");
    } catch {
      exibirAviso("Não foi possível copiar o e-mail.", { tipo: "erro" });
    }
  }

  async function excluir() {
    setExcluindo(true);

    try {
      await removerCandidato(candidato.id);
      setConfirmandoExclusao(false);
      exibirAviso(`${obterPrimeiroNome(candidato.nomeCompleto)} foi excluído(a)`);
      aoExcluir();
    } catch (excecao) {
      exibirAviso(excecao instanceof ErroApi ? excecao.message : "Não foi possível excluir o candidato.", { tipo: "erro" });
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <div className={styles.identificacao}>
        <h2 className={styles.nome}>{candidato.nomeCompleto}</h2>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
        <div className={styles.etiquetas}>
          <Etiqueta variante={candidato.origemCadastro === "Curriculo" ? "primaria" : "neutra"}>
            {candidato.origemCadastro === "Curriculo" ? "PDF" : "Manual"}
          </Etiqueta>
          {candidato.avaliacao && <Etiqueta variante="escura">Nota {formatarNota(candidato.avaliacao.notaGeral)}</Etiqueta>}
        </div>
      </div>

      <div className={styles.acoesRapidas}>
        <a href={`mailto:${candidato.email}`} className={juntarClasses(styles.acaoRapida, styles.acaoPrincipal)}>
          <IconeEmail />
          E-mail
        </a>
        <a
          href={candidato.telefone ? `tel:${candidato.telefone.replace(/\D/g, "")}` : undefined}
          aria-disabled={!candidato.telefone}
          className={juntarClasses(styles.acaoRapida, !candidato.telefone && styles.acaoDesabilitada)}
        >
          <IconeTelefone />
          Ligar
        </a>
        <button type="button" className={styles.acaoRapida} onClick={copiarEmail}>
          <IconeCopiar />
          Copiar
        </button>
      </div>

      <dl className={styles.informacoes}>
        {informacoes.map((informacao) => (
          <div key={informacao.rotulo} className={styles.informacao}>
            <dt>{informacao.rotulo}</dt>
            <dd>{informacao.valor}</dd>
          </div>
        ))}
      </dl>

      <section className={styles.secao}>
        <h3 className={styles.secaoTitulo}>
          Avaliação
          {candidato.avaliacao && !editandoAvaliacao && (
            <Botao variante="texto" tamanho="pequeno" onClick={() => setEditandoAvaliacao(true)}>
              Editar
            </Botao>
          )}
        </h3>
        {editandoAvaliacao ? (
          <FormularioAvaliacao
            candidatoId={candidato.id}
            avaliacaoAtual={candidato.avaliacao}
            aoCancelar={() => setEditandoAvaliacao(false)}
            aoSalvar={() => {
              setEditandoAvaliacao(false);
              aoAlterar();
            }}
          />
        ) : avaliacao ? (
          <div className={styles.avaliacao}>
            <div className={styles.notaGeral}>
              <span className={styles.itemDetalhe}>Nota geral</span>
              <span className={styles.notaGeralValor}>{formatarNota(avaliacao.notaGeral)}</span>
            </div>
            {criteriosNotas.map((criterio) => (
              <BarraNota key={criterio} rotulo={rotulosCriterio[criterio]} nota={avaliacao[criterio]} />
            ))}
            {avaliacao.comentario && <p className={styles.texto}>{avaliacao.comentario}</p>}
            <span className={styles.itemDetalhe}>
              {avaliacao.sugeridaPorIa ? "Notas sugeridas pela IA e confirmadas pelo recrutador" : "Avaliado pelo recrutador"} em{" "}
              {formatarData(avaliacao.dataAtualizacao)}
            </span>
          </div>
        ) : (
          <div className={styles.avaliacao}>
            <p className={styles.semAvaliacao}>Este candidato ainda não foi avaliado.</p>
            <Botao variante="suave" tamanho="pequeno" onClick={() => setEditandoAvaliacao(true)}>
              Avaliar candidato
            </Botao>
          </div>
        )}
      </section>

      {candidato.sobre && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Sobre</h3>
          <p className={styles.texto}>{candidato.sobre}</p>
        </section>
      )}

      {candidato.experiencias.length > 0 && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Experiências</h3>
          <ul className={styles.itens}>
            {candidato.experiencias.map((experiencia, indice) => (
              <li key={`${experiencia.empresa}-${indice}`} className={styles.itemHistorico}>
                <span className={styles.itemTitulo}>{experiencia.cargo}</span>
                <span className={styles.itemDetalhe}>
                  {[experiencia.empresa, formatarPeriodo(experiencia.dataInicio, experiencia.dataFim, experiencia.empregoAtual)].filter(Boolean).join(" · ")}
                </span>
                {experiencia.descricao && <p className={styles.itemDescricao}>{experiencia.descricao}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidato.formacoes.length > 0 && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Formação</h3>
          <ul className={styles.itens}>
            {candidato.formacoes.map((formacao, indice) => (
              <li key={`${formacao.instituicao}-${indice}`} className={styles.itemHistorico}>
                <span className={styles.itemTitulo}>{formacao.curso ?? rotulosNivelFormacao[formacao.nivel]}</span>
                <span className={styles.itemDetalhe}>
                  {[
                    formacao.instituicao,
                    formacao.curso ? rotulosNivelFormacao[formacao.nivel] : null,
                    formatarPeriodo(formacao.dataInicio, formacao.dataConclusao, formacao.emAndamento, "em andamento"),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gruposCompetencias.length > 0 && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Competências</h3>
          {gruposCompetencias.map((grupo) => (
            <div key={grupo.tipo} className={styles.grupoCompetencias}>
              <span className={styles.grupoRotulo}>{rotulosTipoCompetencia[grupo.tipo]}</span>
              <div className={styles.competencias}>
                {grupo.competencias.map((competencia) => (
                  <Etiqueta key={competencia.nome}>
                    {competencia.nome}
                    {competencia.nivel && ` · ${rotulosNivelCompetencia[competencia.nivel]}`}
                  </Etiqueta>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {candidato.curriculo && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Currículo</h3>
          <div className={styles.arquivo}>
            <span className={styles.arquivoIcone} aria-hidden="true">
              <span className={styles.selo}>PDF</span>
            </span>
            <span className={styles.arquivoNome}>{candidato.curriculo.nomeOriginal}</span>
            <a href={obterUrlCurriculo(candidato.id)} target="_blank" rel="noopener noreferrer" className={juntarClasses(styles.acaoRapida)}>
              Abrir
            </a>
          </div>
        </section>
      )}

      <div className={styles.rodape}>
        <LinkBotao href={rotas.editarCandidato(candidato.id)} variante="secundario">
          Editar dados
        </LinkBotao>
        <Botao variante="perigo" onClick={() => setConfirmandoExclusao(true)}>
          Excluir candidato
        </Botao>
      </div>

      <ModalConfirmacao
        aberto={confirmandoExclusao}
        perigoso
        carregando={excluindo}
        titulo={`Excluir ${candidato.nomeCompleto}?`}
        descricao="O cadastro, a avaliação e o currículo anexado serão removidos. Esta ação não pode ser desfeita."
        rotuloConfirmar="Excluir"
        aoCancelar={() => setConfirmandoExclusao(false)}
        aoConfirmar={excluir}
      />
    </>
  );
}
