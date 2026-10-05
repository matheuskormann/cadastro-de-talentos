"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TituloPagina } from "@/components/layout/TituloPagina/TituloPagina";
import { Botao } from "@/components/ui/Botao/Botao";
import { LinkBotao } from "@/components/ui/Botao/LinkBotao";
import { CaixaSelecao } from "@/components/ui/CaixaSelecao/CaixaSelecao";
import { EstadoVazio } from "@/components/ui/EstadoVazio/EstadoVazio";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { Select } from "@/components/ui/Select/Select";
import { rotas } from "@/config/rotas";
import { juntarClasses } from "@/lib/classes";
import { useListaCandidatos } from "../../hooks/useListaCandidatos";
import {
  calcularPosicoes,
  criteriosNotas,
  ordenarPorCriterio,
  possuiAvaliacao,
  rotulosCriterio,
  type CriterioAvaliacao,
} from "../../utils/avaliacao";
import { formatarIdade, formatarLocalizacao, formatarNota } from "../../utils/formatacao";
import { BarraNota } from "../BarraNota/BarraNota";
import { ComparacaoCandidatos } from "./ComparacaoCandidatos";
import styles from "./Ranking.module.css";

const limiteComparacao = 3;
const posicoesPodio = 3;

const opcoesCriterio = (Object.keys(rotulosCriterio) as CriterioAvaliacao[]).map((criterio) => ({
  valor: criterio,
  rotulo: rotulosCriterio[criterio],
}));

export function RankingCandidatos() {
  const { candidatos, carregando, erro, recarregar } = useListaCandidatos();
  const [criterio, setCriterio] = useState<CriterioAvaliacao>("notaGeral");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const avaliados = useMemo(() => ordenarPorCriterio(candidatos.filter(possuiAvaliacao), criterio), [candidatos, criterio]);
  const posicoes = useMemo(() => calcularPosicoes(avaliados, criterio), [avaliados, criterio]);
  const quantidadeSemAvaliacao = candidatos.length - avaliados.length;
  const candidatosComparados = avaliados.filter((candidato) => selecionados.includes(candidato.id));

  function alternarSelecao(id: string) {
    setSelecionados((atuais) => (atuais.includes(id) ? atuais.filter((selecionado) => selecionado !== id) : [...atuais, id]));
  }

  function renderizarConteudo() {
    if (carregando) {
      return <IndicadorCarregamento mensagem="Carregando ranking…" />;
    }

    if (erro) {
      return (
        <EstadoVazio
          titulo="Não foi possível carregar o ranking"
          descricao={erro}
          acao={
            <Botao variante="secundario" tamanho="pequeno" onClick={recarregar}>
              Tentar novamente
            </Botao>
          }
        />
      );
    }

    if (avaliados.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum candidato avaliado"
          descricao="Avalie os candidatos pela ficha ou no cadastro para compará-los aqui."
          acao={
            <LinkBotao href={rotas.candidatos} variante="secundario" tamanho="pequeno">
              Ver candidatos
            </LinkBotao>
          }
        />
      );
    }

    return (
      <>
        <div className={juntarClasses(styles.grade, styles.cabecalhoTabela)} aria-hidden="true">
          <span>#</span>
          <span>Candidato</span>
          {criteriosNotas.map((criterioNota) => (
            <span key={criterioNota} className={juntarClasses(criterio === criterioNota && styles.colunaAtiva)}>
              {rotulosCriterio[criterioNota]}
            </span>
          ))}
          <span className={juntarClasses(criterio === "notaGeral" && styles.colunaAtiva)}>Geral</span>
          <span>Comparar</span>
        </div>
        <ol aria-label={`Ranking por ${rotulosCriterio[criterio].toLowerCase()}`}>
          {avaliados.map((candidato, indice) => {
            const posicao = posicoes[indice];
            const selecionado = selecionados.includes(candidato.id);
            const detalhe = [formatarLocalizacao(candidato.cidade, candidato.estado), formatarIdade(candidato.idade, candidato.idadeEstimada)]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={candidato.id} className={juntarClasses(styles.grade, styles.linha, selecionado && styles.linhaSelecionada)}>
                <span className={juntarClasses(styles.posicao, posicao <= posicoesPodio && styles.podio)} aria-label={`${posicao}º lugar`} title={`${posicao}º lugar`}>
                  {posicao}
                </span>
                <Link href={rotas.detalheCandidato(candidato.id)} className={styles.candidato}>
                  <span className={styles.nome}>{candidato.nomeCompleto}</span>
                  <span className={styles.detalhe}>{detalhe || "Localização não informada"}</span>
                </Link>
                <div className={styles.notas}>
                  {criteriosNotas.map((criterioNota) => (
                    <BarraNota
                      key={criterioNota}
                      compacta
                      exibirRotulo="somenteCelular"
                      rotulo={rotulosCriterio[criterioNota]}
                      nota={candidato.avaliacao[criterioNota]}
                      destaque={criterio === criterioNota}
                    />
                  ))}
                </div>
                <span className={styles.notaGeral}>{formatarNota(candidato.avaliacao.notaGeral)}</span>
                <CaixaSelecao
                  className={styles.comparar}
                  rotulo="Comparar"
                  checked={selecionado}
                  disabled={!selecionado && selecionados.length >= limiteComparacao}
                  aria-label={`Comparar ${candidato.nomeCompleto}`}
                  onChange={() => alternarSelecao(candidato.id)}
                />
              </li>
            );
          })}
        </ol>
      </>
    );
  }

  return (
    <div className={styles.pagina}>
      <TituloPagina titulo="Ranking" descricao="Compare os candidatos avaliados pelas notas de cada critério." />

      <div className={styles.controles}>
        <div className={styles.criterio}>
          Ordenar por
          <div className={styles.seletorCriterio}>
            <Select compacto rotuloAcessivel="Critério do ranking" opcoes={opcoesCriterio} valor={criterio} aoAlterar={(valor) => setCriterio(valor ?? "notaGeral")} />
          </div>
        </div>
        {avaliados.length > 1 && <span className={styles.dica}>Selecione até {limiteComparacao} candidatos para comparar lado a lado.</span>}
      </div>

      {candidatosComparados.length >= 2 && <ComparacaoCandidatos candidatos={candidatosComparados} aoLimpar={() => setSelecionados([])} />}

      <div className={styles.tabela}>{renderizarConteudo()}</div>

      {!carregando && !erro && quantidadeSemAvaliacao > 0 && (
        <p className={styles.semAvaliacao}>
          {quantidadeSemAvaliacao} {quantidadeSemAvaliacao === 1 ? "candidato ainda não foi avaliado e não aparece" : "candidatos ainda não foram avaliados e não aparecem"}{" "}
          no ranking. <Link href={rotas.candidatos}>Ver candidatos</Link>
        </p>
      )}
    </div>
  );
}
