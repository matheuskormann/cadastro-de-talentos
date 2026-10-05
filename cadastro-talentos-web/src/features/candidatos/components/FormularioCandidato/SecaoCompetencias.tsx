"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Botao } from "@/components/ui/Botao/Botao";
import { CampoTexto } from "@/components/ui/Campo/CampoTexto";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import { Select } from "@/components/ui/Select/Select";
import { opcoesNivelCompetencia, opcoesTipoCompetencia } from "../../constants/opcoes";
import type { ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import { criarCompetenciaVazia } from "../../utils/conversoesFormulario";
import styles from "./Formulario.module.css";

export function SecaoCompetencias() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ValoresFormularioCandidato>();

  const { fields: competencias, append, remove } = useFieldArray({ control, name: "competencias" });

  return (
    <Cartao
      titulo="Competências"
      descricao="Conhecimentos técnicos, habilidades comportamentais e idiomas."
      acao={
        <Botao variante="suave" tamanho="pequeno" onClick={() => append(criarCompetenciaVazia())}>
          + Adicionar competência
        </Botao>
      }
    >
      {competencias.length === 0 && <p className={styles.semItens}>Nenhuma competência adicionada.</p>}

      <div className={styles.lista}>
        {competencias.map((competencia, indice) => (
          <div key={competencia.id} className={styles.linhaCompetencia}>
            <CampoTexto
              rotulo="Competência"
              required
              placeholder="Ex.: C#, Inglês, Liderança"
              erro={errors.competencias?.[indice]?.nome?.message}
              {...register(`competencias.${indice}.nome`)}
            />
            <Controller
              control={control}
              name={`competencias.${indice}.tipo`}
              render={({ field }) => <Select rotulo="Tipo" opcoes={opcoesTipoCompetencia} valor={field.value} aoAlterar={(valor) => field.onChange(valor ?? "Tecnica")} />}
            />
            <Controller
              control={control}
              name={`competencias.${indice}.nivel`}
              render={({ field }) => (
                <Select rotulo="Nível" opcoes={opcoesNivelCompetencia} valor={field.value} aoAlterar={field.onChange} permiteLimpar textoVazio="Sem nível" />
              )}
            />
            <Botao variante="perigo" tamanho="pequeno" aria-label={`Remover competência ${indice + 1}`} onClick={() => remove(indice)}>
              Remover
            </Botao>
          </div>
        ))}
      </div>
    </Cartao>
  );
}
