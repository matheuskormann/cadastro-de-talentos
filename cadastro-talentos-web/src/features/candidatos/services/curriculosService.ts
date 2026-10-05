import { clienteHttp } from "@/lib/http/clienteHttp";
import type { ResultadoExtracaoCurriculo } from "../types/curriculo";

export function extrairDadosCurriculo(arquivoCurriculo: File, usarIa: boolean) {
  const formulario = new FormData();
  formulario.append("arquivo", arquivoCurriculo);
  formulario.append("usarIa", String(usarIa));

  return clienteHttp.enviar<ResultadoExtracaoCurriculo>("/api/curriculos/extracao", formulario);
}
