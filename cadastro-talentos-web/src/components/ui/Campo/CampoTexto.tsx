"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Campo, obterClassesControle, obterIdErro } from "./Campo";

interface PropriedadesCampoTexto extends ComponentProps<"input"> {
  rotulo: string;
  erro?: string;
  etiqueta?: ReactNode;
  destacado?: boolean;
  classeCampo?: string;
}

export function CampoTexto({ rotulo, erro, etiqueta, destacado, classeCampo, id, required, ...propriedades }: PropriedadesCampoTexto) {
  const idGerado = useId();
  const idControle = id ?? idGerado;

  return (
    <Campo rotulo={rotulo} idControle={idControle} obrigatorio={required} erro={erro} etiqueta={etiqueta} className={classeCampo}>
      <input
        id={idControle}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? obterIdErro(idControle) : undefined}
        aria-required={required}
        className={obterClassesControle(erro, destacado)}
        {...propriedades}
      />
    </Campo>
  );
}
