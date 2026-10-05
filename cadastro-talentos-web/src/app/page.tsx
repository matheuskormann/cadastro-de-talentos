import { redirect } from "next/navigation";
import { rotas } from "@/config/rotas";

export default function PaginaInicial() {
  redirect(rotas.candidatos);
}
