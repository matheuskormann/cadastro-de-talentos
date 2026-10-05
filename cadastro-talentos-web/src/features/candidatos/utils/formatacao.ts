const mesesAbreviados = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const bytesPorMegabyte = 1024 * 1024;

function lerData(valor: string) {
  return valor.length === 10 ? new Date(`${valor}T00:00:00`) : new Date(valor);
}

export function formatarData(valor: string | null) {
  if (!valor) {
    return "—";
  }

  const data = lerData(valor);
  return `${data.getDate()} ${mesesAbreviados[data.getMonth()]} ${data.getFullYear()}`;
}

function formatarMesAno(valor: string | null) {
  if (!valor) {
    return null;
  }

  const data = lerData(valor);
  return `${mesesAbreviados[data.getMonth()]} ${data.getFullYear()}`;
}

export function formatarPeriodo(inicio: string | null, fim: string | null, emAberto: boolean, rotuloEmAberto = "atual") {
  const textoInicio = formatarMesAno(inicio);
  const textoFim = emAberto ? rotuloEmAberto : formatarMesAno(fim);

  if (!textoInicio && !textoFim) {
    return null;
  }

  return [textoInicio ?? "?", textoFim ?? "?"].join(" – ");
}

export function formatarNascimento(dataNascimento: string | null, estimada: boolean) {
  if (!dataNascimento) {
    return "—";
  }

  return estimada ? `Aprox. ${dataNascimento.slice(0, 4)} (estimado pela idade)` : formatarData(dataNascimento);
}

export function formatarIdade(idade: number | null, estimada: boolean) {
  if (idade === null) {
    return null;
  }

  return `${estimada ? "~" : ""}${idade} anos`;
}

export function formatarTelefone(valor: string) {
  let digitos = valor.replace(/\D/g, "");

  if (digitos.length > 11 && digitos.startsWith("55")) {
    digitos = digitos.slice(2);
  }

  digitos = digitos.slice(0, 11);

  if (digitos.length <= 2) {
    return digitos.length ? `(${digitos}` : "";
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarTamanhoArquivo(bytes: number) {
  if (bytes >= bytesPorMegabyte) {
    return `${(bytes / bytesPorMegabyte).toFixed(1).replace(".", ",")} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatarNota(nota: number | null | undefined) {
  if (nota === null || nota === undefined) {
    return "—";
  }

  return nota.toFixed(1).replace(".", ",").replace(",0", "");
}

export function formatarLocalizacao(cidade: string | null, estado: string | null) {
  return [cidade, estado].filter(Boolean).join(" / ") || null;
}

export function obterPrimeiroNome(nomeCompleto: string) {
  return nomeCompleto.trim().split(/\s+/)[0] ?? nomeCompleto;
}
