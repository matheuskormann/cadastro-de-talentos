"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Botao } from "@/components/ui/Botao/Botao";
import { CaixaSelecao } from "@/components/ui/CaixaSelecao/CaixaSelecao";
import { AreaTexto } from "@/components/ui/Campo/AreaTexto";
import { CampoTexto } from "@/components/ui/Campo/CampoTexto";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import type { ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import { criarExperienciaVazia } from "../../utils/conversoesFormulario";
import styles from "./Formulario.module.css";

export function SecaoExperiencias() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ValoresFormularioCandidato>();

  const { fields: experiencias, append, remove } = useFieldArray({ control, name: "experiencias" });

  return (
    <Cartao
      titulo="Experiências profissionais"
      acao={
        <Botao variante="suave" tamanho="pequeno" onClick={() => append(criarExperienciaVazia())}>
          + Adicionar experiência
        </Botao>
      }
    >
      {experiencias.length === 0 && <p className={styles.semItens}>Nenhuma experiência adicionada.</p>}

      <div className={styles.lista}>
        {experiencias.map((experiencia, indice) => {
          const errosItem = errors.experiencias?.[indice];
          const empregoAtual = watch(`experiencias.${indice}.empregoAtual`);

          return (
            <div key={experiencia.id} className={styles.item}>
              <div className={styles.itemCabecalho}>
                <span className={styles.itemTitulo}>Experiência {indice + 1}</span>
                <Botao variante="perigo" tamanho="pequeno" onClick={() => remove(indice)}>
                  Remover
                </Botao>
              </div>
              <div className={styles.grade}>
                <CampoTexto rotulo="Cargo" required erro={errosItem?.cargo?.message} {...register(`experiencias.${indice}.cargo`)} />
                <CampoTexto rotulo="Empresa" required erro={errosItem?.empresa?.message} {...register(`experiencias.${indice}.empresa`)} />
                <CampoTexto rotulo="Início" type="month" erro={errosItem?.dataInicio?.message} {...register(`experiencias.${indice}.dataInicio`)} />
                {!empregoAtual && (
                  <CampoTexto rotulo="Saída" type="month" erro={errosItem?.dataFim?.message} {...register(`experiencias.${indice}.dataFim`)} />
                )}
                <CaixaSelecao rotulo="Trabalha aqui atualmente" className={styles.larguraTotal} {...register(`experiencias.${indice}.empregoAtual`)} />
                <AreaTexto
                  rotulo="Descrição das atividades"
                  classeCampo={styles.larguraTotal}
                  erro={errosItem?.descricao?.message}
                  {...register(`experiencias.${indice}.descricao`)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
}
