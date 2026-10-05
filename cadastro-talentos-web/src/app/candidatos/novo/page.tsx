import type { Metadata } from "next";
import { TituloPagina } from "@/components/layout/TituloPagina/TituloPagina";
import { FormularioCandidato } from "@/features/candidatos/components/FormularioCandidato/FormularioCandidato";
import styles from "../paginas.module.css";

export const metadata: Metadata = { title: "Novo candidato" };

export default function PaginaNovoCandidato() {
  return (
    <div className={styles.pagina}>
      <TituloPagina destaque titulo="Novo candidato." descricao="Envie o currículo em PDF ou preencha os dados abaixo." />
      <FormularioCandidato />
    </div>
  );
}
