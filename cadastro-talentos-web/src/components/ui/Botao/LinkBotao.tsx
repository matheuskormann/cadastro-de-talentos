import Link from "next/link";
import type { ComponentProps } from "react";
import { obterClassesBotao, type TamanhoBotao, type VarianteBotao } from "./Botao";

interface PropriedadesLinkBotao extends ComponentProps<typeof Link> {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
}

export function LinkBotao({ variante, tamanho, className, ...propriedades }: PropriedadesLinkBotao) {
  return <Link className={obterClassesBotao(variante, tamanho, className)} {...propriedades} />;
}
