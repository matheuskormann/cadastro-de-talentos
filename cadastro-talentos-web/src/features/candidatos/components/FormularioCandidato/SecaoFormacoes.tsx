"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Botao } from "@/components/ui/Botao/Botao";
import { CaixaSelecao } from "@/components/ui/CaixaSelecao/CaixaSelecao";
import { CampoTexto } from "@/components/ui/Campo/CampoTexto";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import { Select } from "@/components/ui/Select/Select";
import { opcoesNivelFormacao } from "../../constants/opcoes";
import type { ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import { criarFormacaoVazia } from "../../utils/conversoesFormulario";
import styles from "./Formulario.module.css";

export function SecaoFormacoes() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ValoresFormularioCandidato>();

  const { fields: formacoes, append, remove } = useFieldArray({ control, name: "formacoes" });

  return (
    <Cartao
      titulo="Formação acadêmica"
      acao={
        <Botao variante="suave" tamanho="pequeno" onClick={() => append(criarFormacaoVazia())}>
          + Adicionar formação
        </Botao>
      }
    >
      {formacoes.length === 0 && <p className={styles.semItens}>Nenhuma formação adicionada.</p>}

      <div className={styles.lista}>
        {formacoes.map((formacao, indice) => {
          const errosItem = errors.formacoes?.[indice];
          const emAndamento = watch(`formacoes.${indice}.emAndamento`);

          return (
            <div key={formacao.id} className={styles.item}>
              <div className={styles.itemCabecalho}>
                <span className={styles.itemTitulo}>Formação {indice + 1}</span>
                <Botao variante="perigo" tamanho="pequeno" onClick={() => remove(indice)}>
                  Remover
                </Botao>
              </div>
              <div className={styles.grade}>
                <Controller
                  control={control}
                  name={`formacoes.${indice}.nivel`}
                  render={({ field }) => (
                    <Select
                      rotulo="Nível"
                      obrigatorio
                      opcoes={opcoesNivelFormacao}
                      valor={field.value}
                      aoAlterar={field.onChange}
                      erro={errosItem?.nivel?.message}
                    />
                  )}
                />
                <CampoTexto rotulo="Curso" placeholder="Opcional para ensino fundamental e médio" erro={errosItem?.curso?.message} {...register(`formacoes.${indice}.curso`)} />
                <CampoTexto
                  rotulo="Instituição"
                  required
                  classeCampo={styles.larguraTotal}
                  erro={errosItem?.instituicao?.message}
                  {...register(`formacoes.${indice}.instituicao`)}
                />
                <CampoTexto rotulo="Início" type="month" erro={errosItem?.dataInicio?.message} {...register(`formacoes.${indice}.dataInicio`)} />
                {!emAndamento && (
                  <CampoTexto
                    rotulo="Conclusão"
                    type="month"
                    erro={errosItem?.dataConclusao?.message}
                    {...register(`formacoes.${indice}.dataConclusao`)}
                  />
                )}
                <CaixaSelecao rotulo="Em andamento" className={styles.larguraTotal} {...register(`formacoes.${indice}.emAndamento`)} />
              </div>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
}
