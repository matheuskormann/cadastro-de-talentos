export type ErrosPorCampo = Record<string, string[]>;

export class ErroApi extends Error {
  readonly status: number;
  readonly errosPorCampo: ErrosPorCampo;

  constructor(mensagem: string, status: number, errosPorCampo: ErrosPorCampo = {}) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
    this.errosPorCampo = errosPorCampo;
  }
}
