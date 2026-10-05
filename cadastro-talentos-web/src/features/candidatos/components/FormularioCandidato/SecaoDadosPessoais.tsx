"use client";

import { Controller, useFormContext } from "react-hook-form";
import { AreaTexto } from "@/components/ui/Campo/AreaTexto";
import { CampoTexto } from "@/components/ui/Campo/CampoTexto";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import { Etiqueta } from "@/components/ui/Etiqueta/Etiqueta";
import { Select } from "@/components/ui/Select/Select";
import { opcoesEstado } from "../../constants/opcoes";
import type { ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import type { CampoExtraivel } from "../../utils/conversoesFormulario";
import { formatarTelefone } from "../../utils/formatacao";
import styles from "./Formulario.module.css";

interface PropriedadesSecaoDadosPessoais {
  camposExtraidos: Set<CampoExtraivel>;
}

const etiquetaExtraido = (
  <Etiqueta variante="destaque" tamanho="pequeno">
    Extraído do PDF
  </Etiqueta>
);

export function SecaoDadosPessoais({ camposExtraidos }: PropriedadesSecaoDadosPessoais) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ValoresFormularioCandidato>();

  const dataNascimentoEstimada = watch("dataNascimentoEstimada");

  function propriedadesExtracao(campo: CampoExtraivel) {
    const extraido = camposExtraidos.has(campo);
    return { destacado: extraido, etiqueta: extraido ? etiquetaExtraido : undefined };
  }

  return (
    <Cartao titulo="Dados do candidato" descricao="Campos com * são obrigatórios.">
      <div className={styles.grade}>
        <CampoTexto
          rotulo="Nome completo"
          required
          placeholder="Ex.: Mariana Souza"
          autoComplete="off"
          classeCampo={styles.larguraTotal}
          erro={errors.nomeCompleto?.message}
          {...propriedadesExtracao("nomeCompleto")}
          {...register("nomeCompleto")}
        />
        <CampoTexto
          rotulo="E-mail"
          required
          type="email"
          placeholder="nome@email.com"
          autoComplete="off"
          erro={errors.email?.message}
          {...propriedadesExtracao("email")}
          {...register("email")}
        />
        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <CampoTexto
              rotulo="Telefone"
              type="tel"
              placeholder="(11) 98765-4321"
              erro={errors.telefone?.message}
              {...propriedadesExtracao("telefone")}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(evento) => field.onChange(formatarTelefone(evento.target.value))}
            />
          )}
        />
        <CampoTexto
          rotulo="Data de nascimento"
          type="date"
          erro={errors.dataNascimento?.message}
          {...propriedadesExtracao("dataNascimento")}
          etiqueta={
            dataNascimentoEstimada ? (
              <Etiqueta variante="alerta" tamanho="pequeno">
                Estimada pela idade
              </Etiqueta>
            ) : (
              propriedadesExtracao("dataNascimento").etiqueta
            )
          }
          {...register("dataNascimento", { onChange: () => setValue("dataNascimentoEstimada", false) })}
        />
        <CampoTexto
          rotulo="Cidade"
          placeholder="Ex.: São Paulo"
          erro={errors.cidade?.message}
          {...propriedadesExtracao("cidade")}
          {...register("cidade")}
        />
        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              rotulo="Estado"
              opcoes={opcoesEstado}
              valor={field.value}
              aoAlterar={field.onChange}
              permiteLimpar
              destacado={camposExtraidos.has("estado")}
              erro={errors.estado?.message}
            />
          )}
        />
        <AreaTexto
          rotulo="Sobre"
          placeholder="Resumo profissional, objetivos, disponibilidade…"
          classeCampo={styles.larguraTotal}
          rows={4}
          erro={errors.sobre?.message}
          {...propriedadesExtracao("sobre")}
          {...register("sobre")}
        />
      </div>
    </Cartao>
  );
}
