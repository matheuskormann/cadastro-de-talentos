"use client";

import { useRef, useState, type DragEvent } from "react";
import { Alerta } from "@/components/ui/Alerta/Alerta";
import { Botao } from "@/components/ui/Botao/Botao";
import { ControleSegmentado } from "@/components/ui/ControleSegmentado/ControleSegmentado";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { juntarClasses } from "@/lib/classes";
import { rotulosMetodoExtracao } from "../../constants/opcoes";
import type { ResultadoExtracaoCurriculo } from "../../types/curriculo";
import { formatarTamanhoArquivo } from "../../utils/formatacao";
import styles from "./EnvioCurriculo.module.css";

export type EstadoEnvio = "ocioso" | "lendo" | "lido";
type ModoLeitura = "ia" | "regras";

interface PropriedadesEnvioCurriculo {
  estado: EstadoEnvio;
  arquivo: File | null;
  resultado: ResultadoExtracaoCurriculo | null;
  erro: string | null;
  usarIa: boolean;
  aoAlterarUsarIa: (usarIa: boolean) => void;
  aoSelecionarArquivo: (arquivo: File) => void;
  aoRemoverArquivo: () => void;
}

const opcoesLeitura = [
  { valor: "ia" as const, rotulo: "Inteligência artificial" },
  { valor: "regras" as const, rotulo: "Regras automáticas" },
];

function descreverCampo(rotulo: string, valor: unknown) {
  const encontrado = Boolean(valor);
  return { texto: `${rotulo} ${encontrado ? "encontrado" : "não encontrado"}`, encontrado };
}

function descreverLista(quantidade: number, singular: string, plural: string, nenhum: string) {
  return { texto: quantidade === 0 ? nenhum : `${quantidade} ${quantidade === 1 ? singular : plural}`, encontrado: quantidade > 0 };
}

function listarEncontrados({ dados }: ResultadoExtracaoCurriculo) {
  return [
    descreverCampo("Nome", dados.nomeCompleto),
    descreverCampo("E-mail", dados.email),
    descreverCampo("Telefone", dados.telefone),
    descreverCampo("Nascimento", dados.dataNascimento),
    descreverLista(dados.experiencias.length, "experiência", "experiências", "Nenhuma experiência"),
    descreverLista(dados.formacoes.length, "formação", "formações", "Nenhuma formação"),
    descreverLista(dados.competencias.length, "competência", "competências", "Nenhuma competência"),
  ];
}

export function EnvioCurriculo({
  estado,
  arquivo,
  resultado,
  erro,
  usarIa,
  aoAlterarUsarIa,
  aoSelecionarArquivo,
  aoRemoverArquivo,
}: PropriedadesEnvioCurriculo) {
  const referenciaEntrada = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  function abrirSeletor() {
    referenciaEntrada.current?.click();
  }

  function receberArquivo(lista: FileList | null) {
    const arquivoSelecionado = lista?.[0];

    if (arquivoSelecionado) {
      aoSelecionarArquivo(arquivoSelecionado);
    }
  }

  const eventosArrasto = {
    onDragOver: (evento: DragEvent) => {
      evento.preventDefault();
      setArrastando(true);
    },
    onDragLeave: (evento: DragEvent) => {
      if (!evento.currentTarget.contains(evento.relatedTarget as Node)) {
        setArrastando(false);
      }
    },
    onDrop: (evento: DragEvent) => {
      evento.preventDefault();
      setArrastando(false);
      receberArquivo(evento.dataTransfer.files);
    },
  };

  return (
    <div className={styles.envio}>
      <div className={styles.opcoesLeitura}>
        Ler o currículo com
        <ControleSegmentado
          rotuloAcessivel="Método de leitura do currículo"
          opcoes={opcoesLeitura}
          valor={usarIa ? "ia" : "regras"}
          aoAlterar={(modo: ModoLeitura) => aoAlterarUsarIa(modo === "ia")}
        />
      </div>

      <input
        ref={referenciaEntrada}
        type="file"
        accept="application/pdf,.pdf"
        className={styles.entradaArquivo}
        onChange={(evento) => {
          receberArquivo(evento.target.files);
          evento.target.value = "";
        }}
      />

      {estado === "ocioso" && (
        <button type="button" className={juntarClasses(styles.area, arrastando && styles.arrastando)} onClick={abrirSeletor} {...eventosArrasto}>
          <span className={styles.documento} aria-hidden="true">
            <span className={styles.selo}>PDF</span>
          </span>
          <span className={styles.textos}>
            <span className={styles.titulo}>{arrastando ? "Solte para enviar" : "Arraste o currículo em PDF aqui"}</span>
            <span className={styles.subtitulo}>Os dados encontrados preenchem o formulário. Arquivo de até 5 MB.</span>
          </span>
          <span className={styles.escolher}>Escolher arquivo</span>
        </button>
      )}

      {estado === "lendo" && (
        <div className={juntarClasses(styles.area, styles.lendo)} role="status">
          <IndicadorCarregamento />
          <div className={styles.textos}>
            <div className={styles.linhaLeitura}>
              <span className={styles.titulo}>{usarIa ? "Lendo o currículo com IA…" : "Lendo o currículo…"}</span>
              <span className={styles.nomeArquivo}>{arquivo?.name}</span>
            </div>
            <div className={styles.progresso} />
          </div>
        </div>
      )}

      {estado === "lido" && arquivo && resultado && (
        <div className={styles.arquivo} {...eventosArrasto}>
          <span className={juntarClasses(styles.documento, styles.documentoPequeno)} aria-hidden="true">
            <span className={styles.selo}>PDF</span>
          </span>
          <div className={styles.arquivoTextos}>
            <div className={styles.arquivoNome}>
              <strong>{arquivo.name}</strong>
              <span className={styles.arquivoTamanho}>{formatarTamanhoArquivo(arquivo.size)}</span>
            </div>
            <ul className={styles.encontrados} aria-label="Dados encontrados no currículo">
              {listarEncontrados(resultado).map((item) => (
                <li key={item.texto} className={juntarClasses(styles.encontrado, item.encontrado && styles.encontradoSim)}>
                  <span className={styles.marca} aria-hidden="true">
                    {item.encontrado ? "✓" : "–"}
                  </span>
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.acoesArquivo}>
            <Botao variante="secundario" tamanho="pequeno" onClick={abrirSeletor}>
              Trocar
            </Botao>
            <Botao variante="perigo" tamanho="pequeno" onClick={aoRemoverArquivo}>
              Remover
            </Botao>
          </div>
        </div>
      )}

      {estado === "lido" && resultado && (
        <Alerta variante={resultado.aviso ? "atencao" : "informacao"} titulo={`Dados lidos por ${rotulosMetodoExtracao[resultado.metodoUtilizado].toLowerCase()}`}>
          {resultado.aviso ?? "Confira as informações encontradas e complete o que faltar antes de salvar."}
        </Alerta>
      )}

      {erro && <Alerta variante="erro">{erro}</Alerta>}
    </div>
  );
}
