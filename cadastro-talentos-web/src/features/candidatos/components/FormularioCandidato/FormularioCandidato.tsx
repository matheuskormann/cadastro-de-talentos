"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, type Path } from "react-hook-form";
import type { z } from "zod";
import { useAvisos } from "@/components/ui/Avisos/ProvedorAvisos";
import { Botao } from "@/components/ui/Botao/Botao";
import { rotas } from "@/config/rotas";
import { ErroApi } from "@/lib/http/ErroApi";
import { tamanhoMaximoCurriculoBytes } from "../../constants/opcoes";
import { esquemaCandidato, type ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import { atualizarCandidato, cadastrarCandidato } from "../../services/candidatosService";
import { extrairDadosCurriculo } from "../../services/curriculosService";
import type { ResultadoExtracaoCurriculo } from "../../types/curriculo";
import {
  converterFormularioParaEnvio,
  mesclarDadosExtraidos,
  separarErrosApi,
  valoresIniciaisCandidato,
  type CampoExtraivel,
} from "../../utils/conversoesFormulario";
import { obterPrimeiroNome } from "../../utils/formatacao";
import { EnvioCurriculo, type EstadoEnvio } from "../EnvioCurriculo/EnvioCurriculo";
import styles from "./Formulario.module.css";
import { SecaoAvaliacao } from "./SecaoAvaliacao";
import { SecaoCompetencias } from "./SecaoCompetencias";
import { SecaoDadosPessoais } from "./SecaoDadosPessoais";
import { SecaoExperiencias } from "./SecaoExperiencias";
import { SecaoFormacoes } from "./SecaoFormacoes";

type ValoresValidados = z.output<typeof esquemaCandidato>;

interface PropriedadesFormularioCandidato {
  candidatoId?: string;
  valoresIniciais?: ValoresFormularioCandidato;
}

const mensagemFalhaSalvar = "Não foi possível salvar o candidato. Revise os campos destacados.";

function validarArquivo(arquivo: File) {
  if (!/\.pdf$/i.test(arquivo.name)) {
    return "O arquivo enviado não é um PDF válido.";
  }

  if (arquivo.size > tamanhoMaximoCurriculoBytes) {
    return "O arquivo excede o tamanho máximo de 5 MB.";
  }

  return null;
}

export function FormularioCandidato({ candidatoId, valoresIniciais = valoresIniciaisCandidato }: PropriedadesFormularioCandidato) {
  const router = useRouter();
  const { exibirAviso } = useAvisos();
  const modoEdicao = Boolean(candidatoId);

  const formulario = useForm<ValoresFormularioCandidato, unknown, ValoresValidados>({
    resolver: zodResolver(esquemaCandidato),
    defaultValues: valoresIniciais,
  });

  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>("ocioso");
  const [arquivoCurriculo, setArquivoCurriculo] = useState<File | null>(null);
  const [resultadoExtracao, setResultadoExtracao] = useState<ResultadoExtracaoCurriculo | null>(null);
  const [erroCurriculo, setErroCurriculo] = useState<string | null>(null);
  const [camposExtraidos, setCamposExtraidos] = useState<Set<CampoExtraivel>>(new Set());
  const [usarIa, setUsarIa] = useState(true);

  async function lerCurriculo(arquivo: File) {
    const erroValidacao = validarArquivo(arquivo);

    if (erroValidacao) {
      setErroCurriculo(erroValidacao);
      return;
    }

    setErroCurriculo(null);
    setArquivoCurriculo(arquivo);
    setEstadoEnvio("lendo");

    try {
      const resultado = await extrairDadosCurriculo(arquivo, usarIa);
      const { valoresMesclados, camposPreenchidos } = mesclarDadosExtraidos(formulario.getValues(), resultado.dados);

      formulario.reset(valoresMesclados, { keepDefaultValues: true });
      setResultadoExtracao(resultado);
      setCamposExtraidos(new Set(camposPreenchidos));
      setEstadoEnvio("lido");
    } catch (excecao) {
      const mensagem = excecao instanceof ErroApi ? (excecao.errosPorCampo.curriculo?.[0] ?? excecao.message) : "Falha na leitura do currículo.";

      setErroCurriculo(`${mensagem} Você pode preencher os dados manualmente.`);
      setArquivoCurriculo(null);
      setEstadoEnvio("ocioso");
    }
  }

  function removerCurriculo() {
    setArquivoCurriculo(null);
    setResultadoExtracao(null);
    setCamposExtraidos(new Set());
    setErroCurriculo(null);
    setEstadoEnvio("ocioso");
  }

  function limparFormulario() {
    formulario.reset(valoresIniciaisCandidato);
    removerCurriculo();
  }

  function aplicarErrosApi(excecao: ErroApi) {
    const { erroCurriculo: mensagemCurriculo, erroDados, errosFormulario } = separarErrosApi(excecao.errosPorCampo);

    for (const { caminho, mensagem } of errosFormulario) {
      formulario.setError(caminho as Path<ValoresFormularioCandidato>, { message: mensagem });
    }

    if (excecao.status === 409) {
      formulario.setError("email", { message: excecao.message });
    }

    if (mensagemCurriculo) {
      setErroCurriculo(mensagemCurriculo);
    }

    const errosVisiveisNoFormulario = errosFormulario.length > 0 || excecao.status === 409;
    exibirAviso(errosVisiveisNoFormulario ? mensagemFalhaSalvar : (mensagemCurriculo ?? erroDados ?? excecao.message), { tipo: "erro" });
  }

  async function salvar(valores: ValoresValidados) {
    const dadosCandidato = converterFormularioParaEnvio(valores);

    try {
      const candidato = candidatoId
        ? await atualizarCandidato(candidatoId, dadosCandidato)
        : await cadastrarCandidato(dadosCandidato, arquivoCurriculo);

      const primeiroNome = obterPrimeiroNome(candidato.nomeCompleto);

      if (modoEdicao) {
        exibirAviso(`Dados de ${primeiroNome} atualizados`);
        router.push(rotas.detalheCandidato(candidato.id));
        return;
      }

      limparFormulario();
      window.scrollTo({ top: 0, behavior: "smooth" });
      exibirAviso(`${primeiroNome} foi cadastrado(a)`, {
        acao: { rotulo: "Ver ficha", aoClicar: () => router.push(rotas.detalheCandidato(candidato.id)) },
      });
    } catch (excecao) {
      if (excecao instanceof ErroApi) {
        aplicarErrosApi(excecao);
        return;
      }

      exibirAviso("Ocorreu um erro inesperado ao salvar.", { tipo: "erro" });
    }
  }

  return (
    <FormProvider {...formulario}>
      <form className={styles.formulario} noValidate onSubmit={formulario.handleSubmit(salvar)}>
        {!modoEdicao && (
          <EnvioCurriculo
            estado={estadoEnvio}
            arquivo={arquivoCurriculo}
            resultado={resultadoExtracao}
            erro={erroCurriculo}
            usarIa={usarIa}
            aoAlterarUsarIa={setUsarIa}
            aoSelecionarArquivo={lerCurriculo}
            aoRemoverArquivo={removerCurriculo}
          />
        )}

        <SecaoDadosPessoais camposExtraidos={camposExtraidos} />
        <SecaoExperiencias />
        <SecaoFormacoes />
        <SecaoCompetencias />
        <SecaoAvaliacao />

        <div className={styles.acoes}>
          {modoEdicao ? (
            <Botao variante="texto" onClick={() => router.back()}>
              Cancelar
            </Botao>
          ) : (
            <Botao variante="texto" onClick={limparFormulario}>
              Limpar
            </Botao>
          )}
          <Botao type="submit" carregando={formulario.formState.isSubmitting} disabled={estadoEnvio === "lendo"}>
            {modoEdicao ? "Salvar alterações" : "Salvar candidato"}
          </Botao>
        </div>
      </form>
    </FormProvider>
  );
}
