import type { Metadata } from "next";
import { Suspense } from "react";
import { IndicadorCarregamento } from "@/components/ui/IndicadorCarregamento/IndicadorCarregamento";
import { ListaCandidatos } from "@/features/candidatos/components/ListaCandidatos/ListaCandidatos";

export const metadata: Metadata = { title: "Candidatos" };

export default function PaginaCandidatos() {
  return (
    <Suspense fallback={<IndicadorCarregamento mensagem="Carregando candidatos…" />}>
      <ListaCandidatos />
    </Suspense>
  );
}
