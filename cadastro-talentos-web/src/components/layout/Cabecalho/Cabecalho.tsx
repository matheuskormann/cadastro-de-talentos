"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estilosControleSegmentado } from "@/components/ui/ControleSegmentado/ControleSegmentado";
import { juntarClasses } from "@/lib/classes";
import { rotas } from "@/config/rotas";
import styles from "./Cabecalho.module.css";

interface ItemNavegacao {
  rotulo: string;
  rota: string;
  estaAtivo: (caminhoAtual: string) => boolean;
}

const itensNavegacao: ItemNavegacao[] = [
  {
    rotulo: "Cadastrar",
    rota: rotas.novoCandidato,
    estaAtivo: (caminhoAtual) => caminhoAtual.startsWith(rotas.novoCandidato),
  },
  {
    rotulo: "Candidatos",
    rota: rotas.candidatos,
    estaAtivo: (caminhoAtual) => caminhoAtual.startsWith(rotas.candidatos) && !caminhoAtual.startsWith(rotas.novoCandidato),
  },
  {
    rotulo: "Ranking",
    rota: rotas.ranking,
    estaAtivo: (caminhoAtual) => caminhoAtual.startsWith(rotas.ranking),
  },
];

export function Cabecalho() {
  const caminhoAtual = usePathname();

  return (
    <header className={styles.cabecalho}>
      <div className={styles.conteudo}>
        <Link href={rotas.candidatos} className={styles.marca} aria-label="Talentos: ir para a lista de candidatos">
          <Image src="/logo.png" alt="" width={30} height={30} priority className={styles.simbolo} />
          <span className={styles.nome}>Talentos</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className={juntarClasses(estilosControleSegmentado.trilho, estilosControleSegmentado.claro, styles.navegacao)}
        >
          {itensNavegacao.map((item) => {
            const ativo = item.estaAtivo(caminhoAtual);

            return (
              <Link
                key={item.rota}
                href={item.rota}
                aria-current={ativo ? "page" : undefined}
                className={juntarClasses(
                  estilosControleSegmentado.segmento,
                  estilosControleSegmentado.segmentoLargo,
                  ativo && estilosControleSegmentado.selecionado,
                )}
              >
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className={styles.lateral} />
      </div>
    </header>
  );
}
