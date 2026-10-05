"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CaixaSelecao } from "@/components/ui/CaixaSelecao/CaixaSelecao";
import { AreaTexto } from "@/components/ui/Campo/AreaTexto";
import { Cartao } from "@/components/ui/Cartao/Cartao";
import { EscalaNota } from "@/components/ui/EscalaNota/EscalaNota";
import { Etiqueta } from "@/components/ui/Etiqueta/Etiqueta";
import type { ValoresFormularioCandidato } from "../../schemas/esquemaCandidato";
import { calcularNotaGeral } from "../../utils/avaliacao";
import { formatarNota } from "../../utils/formatacao";
import styles from "./Formulario.module.css";

const criterios = [
  { campo: "notaExperiencia", rotulo: "Experiência" },
  { campo: "notaFormacao", rotulo: "Formação" },
  { campo: "notaComunicacao", rotulo: "Comunicação" },
] as const;

export function SecaoAvaliacao() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ValoresFormularioCandidato>();

  const avaliacao = watch("avaliacao");
  const notaGeral = calcularNotaGeral(avaliacao.notaExperiencia, avaliacao.notaFormacao, avaliacao.notaComunicacao);

  return (
    <Cartao
      titulo="Avaliação"
      descricao="Notas de 0 a 10. A comunicação considera apenas o texto do currículo."
      acao={
        avaliacao.incluir &&
        avaliacao.sugeridaPorIa && (
          <Etiqueta variante="destaque">Sugestão da IA — revise as notas</Etiqueta>
        )
      }
    >
      <CaixaSelecao rotulo="Avaliar este candidato agora" {...register("avaliacao.incluir")} />

      {avaliacao.incluir && (
        <>
          {criterios.map((criterio) => (
            <Controller
              key={criterio.campo}
              control={control}
              name={`avaliacao.${criterio.campo}`}
              render={({ field }) => (
                <EscalaNota
                  rotulo={criterio.rotulo}
                  valor={field.value}
                  erro={errors.avaliacao?.[criterio.campo]?.message}
                  aoAlterar={(nota) => {
                    field.onChange(nota);
                    setValue("avaliacao.sugeridaPorIa", false);
                  }}
                />
              )}
            />
          ))}

          <div className={styles.notaGeral}>
            Nota geral
            <span className={styles.notaGeralValor}>{formatarNota(notaGeral)}</span>
          </div>

          <AreaTexto rotulo="Comentário" rows={4} erro={errors.avaliacao?.comentario?.message} {...register("avaliacao.comentario")} />
        </>
      )}
    </Cartao>
  );
}
