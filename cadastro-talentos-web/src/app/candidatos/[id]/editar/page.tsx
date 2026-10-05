import type { Metadata } from "next";
import { EdicaoCandidato } from "@/features/candidatos/components/EdicaoCandidato/EdicaoCandidato";

export const metadata: Metadata = { title: "Editar candidato" };

interface PropriedadesPaginaEditar {
  params: Promise<{ id: string }>;
}

export default async function PaginaEditarCandidato({ params }: PropriedadesPaginaEditar) {
  const { id } = await params;

  return <EdicaoCandidato candidatoId={id} />;
}
