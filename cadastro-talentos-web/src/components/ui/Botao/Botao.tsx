import type { ButtonHTMLAttributes } from "react";
import { juntarClasses } from "@/lib/classes";
import styles from "./Botao.module.css";

export type VarianteBotao = "primario" | "secundario" | "suave" | "texto" | "perigo" | "perigoSolido";
export type TamanhoBotao = "medio" | "pequeno";

interface PropriedadesBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  carregando?: boolean;
}

export function obterClassesBotao(variante: VarianteBotao = "primario", tamanho: TamanhoBotao = "medio", classeExtra?: string) {
  return juntarClasses(styles.botao, styles[variante], styles[tamanho], classeExtra);
}

export function Botao({
  variante = "primario",
  tamanho = "medio",
  carregando = false,
  type = "button",
  disabled,
  className,
  children,
  ...propriedades
}: PropriedadesBotao) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando}
      className={obterClassesBotao(variante, tamanho, className)}
      {...propriedades}
    >
      {carregando && <span className={styles.indicador} aria-hidden="true" />}
      {children}
    </button>
  );
}
