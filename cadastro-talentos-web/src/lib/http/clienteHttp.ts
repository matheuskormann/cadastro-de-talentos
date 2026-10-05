import { ambiente } from "@/config/ambiente";
import { ErroApi, type ErrosPorCampo } from "./ErroApi";

type MetodoHttp = "GET" | "POST" | "PUT" | "DELETE";
type CorpoRequisicao = FormData | object;

interface ProblemaApi {
  title?: string;
  detail?: string;
  errors?: ErrosPorCampo;
}

const mensagemFalhaConexao = "Não foi possível conectar ao servidor. Verifique se a API está em execução.";
const mensagemErroInesperado = "Ocorreu um erro inesperado. Tente novamente.";
const statusSemConteudo = 204;

function montarRequisicao(metodo: MetodoHttp, corpo?: CorpoRequisicao): RequestInit {
  if (corpo === undefined) {
    return { method: metodo, cache: "no-store" };
  }

  if (corpo instanceof FormData) {
    return { method: metodo, body: corpo };
  }

  return {
    method: metodo,
    body: JSON.stringify(corpo),
    headers: { "Content-Type": "application/json" },
  };
}

async function converterErro(resposta: Response): Promise<ErroApi> {
  const problema: ProblemaApi = await resposta.json().catch(() => ({}));
  const mensagem = problema.detail ?? problema.title ?? mensagemErroInesperado;

  return new ErroApi(mensagem, resposta.status, problema.errors);
}

async function requisitar<Resposta>(metodo: MetodoHttp, caminho: string, corpo?: CorpoRequisicao): Promise<Resposta> {
  let resposta: Response;

  try {
    resposta = await fetch(`${ambiente.urlApi}${caminho}`, montarRequisicao(metodo, corpo));
  } catch {
    throw new ErroApi(mensagemFalhaConexao, 0);
  }

  if (!resposta.ok) {
    throw await converterErro(resposta);
  }

  if (resposta.status === statusSemConteudo) {
    return undefined as Resposta;
  }

  return resposta.json();
}

export const clienteHttp = {
  obter: <Resposta>(caminho: string) => requisitar<Resposta>("GET", caminho),
  enviar: <Resposta>(caminho: string, corpo: CorpoRequisicao) => requisitar<Resposta>("POST", caminho, corpo),
  atualizar: <Resposta>(caminho: string, corpo: CorpoRequisicao) => requisitar<Resposta>("PUT", caminho, corpo),
  remover: (caminho: string) => requisitar<void>("DELETE", caminho),
};
