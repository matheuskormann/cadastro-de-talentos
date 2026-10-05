"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { TituloPagina } from "@/components/layout/TituloPagina/TituloPagina";
import { Botao } from "@/components/ui/Botao/Botao";
import { LinkBotao } from "@/components/ui/Botao/LinkBotao";
import { ControleSegmentado } from "@/components/ui/ControleSegmentado/ControleSegmentado";
import { EstadoVazio } from "@/components/ui/EstadoVazio/EstadoVazio";
import { Etiqueta } from "@/components/ui/Etiqueta/Etiqueta";
import { IconeAvancar, IconeBusca } from "@/components/ui/Icones/Icones";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { Select } from "@/components/ui/Select/Select";
import { rotas } from "@/config/rotas";
import { juntarClasses } from "@/lib/classes";
import { useListaCandidatos } from "../../hooks/useListaCandidatos";
import type { CandidatoResumo, OrigemCadastro } from "../../types/candidato";
import { formatarData, formatarIdade, formatarLocalizacao, formatarNota, formatarTelefone } from "../../utils/formatacao";
import { PainelCandidato } from "../PainelCandidato/PainelCandidato";
import styles from "./ListaCandidatos.module.css";

type FiltroOrigem = "todos" | OrigemCadastro;
type Ordenacao = "recentes" | "nome" | "nota";

const parametroCandidato = "candidato";

const opcoesOrigem = [
  { valor: "todos" as const, rotulo: "Todos" },
  { valor: "Curriculo" as const, rotulo: "Via PDF" },
  { valor: "Manual" as const, rotulo: "Manual" },
];

const opcoesOrdenacao = [
  { valor: "recentes" as const, rotulo: "Mais recentes" },
  { valor: "nome" as const, rotulo: "Nome (A–Z)" },
  { valor: "nota" as const, rotulo: "Maior nota" },
];

const comparadores: Record<Ordenacao, (primeiro: CandidatoResumo, segundo: CandidatoResumo) => number> = {
  recentes: (primeiro, segundo) => segundo.dataCadastro.localeCompare(primeiro.dataCadastro),
  nome: (primeiro, segundo) => primeiro.nomeCompleto.localeCompare(segundo.nomeCompleto, "pt-BR"),
  nota: (primeiro, segundo) => (segundo.avaliacao?.notaGeral ?? -1) - (primeiro.avaliacao?.notaGeral ?? -1),
};

function correspondeBusca(candidato: CandidatoResumo, termo: string) {
  const termoNormalizado = termo.trim().toLowerCase();
  const digitosBusca = termoNormalizado.replace(/\D/g, "");

  if (!termoNormalizado) {
    return true;
  }

  const textos = [candidato.nomeCompleto, candidato.email, candidato.cidade, candidato.estado];
  const encontrouTexto = textos.some((texto) => texto?.toLowerCase().includes(termoNormalizado));
  const encontrouTelefone = digitosBusca.length > 2 && (candidato.telefone ?? "").replace(/\D/g, "").includes(digitosBusca);

  return encontrouTexto || encontrouTelefone;
}

function descreverResultado(totalFiltrado: number, total: number) {
  if (totalFiltrado === total) {
    return `${total} ${total === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}`;
  }

  return `${totalFiltrado} de ${total} candidatos`;
}

export function ListaCandidatos() {
  const router = useRouter();
  const caminhoAtual = usePathname();
  const parametros = useSearchParams();
  const candidatoSelecionadoId = parametros.get(parametroCandidato);

  const { candidatos, carregando, erro, recarregar } = useListaCandidatos();
  const [busca, setBusca] = useState("");
  const [origem, setOrigem] = useState<FiltroOrigem>("todos");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");

  const candidatosVisiveis = useMemo(
    () =>
      candidatos
        .filter((candidato) => origem === "todos" || candidato.origemCadastro === origem)
        .filter((candidato) => correspondeBusca(candidato, busca))
        .sort(comparadores[ordenacao]),
    [candidatos, origem, busca, ordenacao],
  );

  const abrirCandidato = (id: string) => router.replace(`${caminhoAtual}?${parametroCandidato}=${id}`, { scroll: false });
  const fecharCandidato = useCallback(() => router.replace(caminhoAtual, { scroll: false }), [router, caminhoAtual]);

  function limparFiltros() {
    setBusca("");
    setOrigem("todos");
  }

  function renderizarConteudo() {
    if (carregando) {
      return <IndicadorCarregamento mensagem="Carregando candidatos…" />;
    }

    if (erro) {
      return (
        <EstadoVazio
          titulo="Não foi possível carregar os candidatos"
          descricao={erro}
          acao={
            <Botao variante="secundario" tamanho="pequeno" onClick={recarregar}>
              Tentar novamente
            </Botao>
          }
        />
      );
    }

    if (candidatos.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum candidato cadastrado"
          descricao="Cadastre o primeiro candidato enviando um currículo em PDF ou preenchendo o formulário."
          acao={
            <LinkBotao href={rotas.novoCandidato} tamanho="pequeno">
              Cadastrar candidato
            </LinkBotao>
          }
        />
      );
    }

    if (candidatosVisiveis.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum candidato encontrado"
          descricao="Tente outro termo ou limpe os filtros."
          acao={
            <Botao variante="secundario" tamanho="pequeno" onClick={limparFiltros}>
              Limpar filtros
            </Botao>
          }
        />
      );
    }

    return (
      <>
        <div className={juntarClasses(styles.grade, styles.cabecalhoTabela)} aria-hidden="true">
          <span>Candidato</span>
          <span>Contato</span>
          <span>Nota</span>
          <span>Cadastro</span>
          <span>Origem</span>
          <span />
        </div>
        <ul aria-label="Candidatos">
          {candidatosVisiveis.map((candidato) => {
            const detalhe = [formatarLocalizacao(candidato.cidade, candidato.estado), formatarIdade(candidato.idade, candidato.idadeEstimada)]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={candidato.id}>
                <button
                  type="button"
                  className={juntarClasses(styles.grade, styles.linha, candidato.id === candidatoSelecionadoId && styles.linhaSelecionada)}
                  onClick={() => abrirCandidato(candidato.id)}
                >
                  <span className={styles.celulaPrincipal}>
                    <span className={styles.nome}>{candidato.nomeCompleto}</span>
                    <span className={styles.detalhe}>{detalhe || "Localização não informada"}</span>
                  </span>
                  <span className={styles.celulaContato}>
                    <span className={styles.nome}>{candidato.email}</span>
                    <span className={styles.detalhe}>{candidato.telefone ? formatarTelefone(candidato.telefone) : "—"}</span>
                  </span>
                  <span className={styles.celulaNota}>
                    {candidato.avaliacao ? (
                      <Etiqueta variante="escura">{formatarNota(candidato.avaliacao.notaGeral)}</Etiqueta>
                    ) : (
                      <span className={styles.semNota}>Sem nota</span>
                    )}
                  </span>
                  <span className={juntarClasses(styles.texto, styles.celulaData)}>{formatarData(candidato.dataCadastro)}</span>
                  <span className={styles.celulaOrigem}>
                    <Etiqueta variante={candidato.origemCadastro === "Curriculo" ? "primaria" : "neutra"}>
                      {candidato.origemCadastro === "Curriculo" ? "PDF" : "Manual"}
                    </Etiqueta>
                  </span>
                  <IconeAvancar className={styles.seta} />
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <div className={styles.pagina}>
      <TituloPagina
        titulo="Candidatos"
        descricao={carregando || erro ? undefined : descreverResultado(candidatosVisiveis.length, candidatos.length)}
        acao={
          <LinkBotao href={rotas.novoCandidato}>
            <span aria-hidden="true">+</span>
            Novo candidato
          </LinkBotao>
        }
      />

      <div className={styles.filtros}>
        <label className={styles.busca}>
          <IconeBusca />
          <input
            className={styles.campoBusca}
            value={busca}
            placeholder="Nome, e-mail, telefone ou cidade"
            aria-label="Buscar candidatos"
            onChange={(evento) => setBusca(evento.target.value)}
          />
          {busca && (
            <button type="button" className={styles.limparBusca} aria-label="Limpar busca" onClick={() => setBusca("")}>
              ×
            </button>
          )}
        </label>
        <ControleSegmentado rotuloAcessivel="Filtrar por origem" opcoes={opcoesOrigem} valor={origem} aoAlterar={setOrigem} />
        <div className={styles.ordenacao}>
          <Select
            compacto
            rotuloAcessivel="Ordenar candidatos"
            opcoes={opcoesOrdenacao}
            valor={ordenacao}
            aoAlterar={(valor) => setOrdenacao(valor ?? "recentes")}
          />
        </div>
      </div>

      <div className={styles.tabela}>{renderizarConteudo()}</div>

      <PainelCandidato candidatoId={candidatoSelecionadoId} aoFechar={fecharCandidato} aoAlterarCandidato={recarregar} />
    </div>
  );
}
