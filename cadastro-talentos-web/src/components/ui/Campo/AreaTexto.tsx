"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Campo, estilosCampo, obterClassesControle, obterIdErro } from "./Campo";

interface PropriedadesAreaTexto extends ComponentProps<"textarea"> {
  rotulo: string;
  erro?: string;
  etiqueta?: ReactNode;
  destacado?: boolean;
  classeCampo?: string;
}

export function AreaTexto({ rotulo, erro, etiqueta, destacado, classeCampo, id, required, rows = 3, ...propriedades }: PropriedadesAreaTexto) {
  const idGerado = useId();
  const idControle = id ?? idGerado;

  return (
    <Campo rotulo={rotulo} idControle={idControle} obrigatorio={required} erro={erro} etiqueta={etiqueta} className={classeCampo}>
      <textarea
        id={idControle}
        rows={rows}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? obterIdErro(idControle) : undefined}
        aria-required={required}
        className={obterClassesControle(erro, destacado, estilosCampo.areaTexto)}
        {...propriedades}
      />
    </Campo>
  );
}
