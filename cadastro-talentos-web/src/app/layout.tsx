import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cabecalho } from "@/components/layout/Cabecalho/Cabecalho";
import { ProvedorAvisos } from "@/components/ui/Avisos/ProvedorAvisos";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: {
    default: "Talentos",
    template: "%s | Talentos",
  },
  description: "Cadastro e consulta de candidatos a partir de currículos",
};

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ProvedorAvisos>
          <Cabecalho />
          <main className={styles.conteudo}>{children}</main>
        </ProvedorAvisos>
      </body>
    </html>
  );
}
