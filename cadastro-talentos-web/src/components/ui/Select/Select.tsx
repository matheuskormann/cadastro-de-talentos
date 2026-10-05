"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { juntarClasses } from "@/lib/classes";
import { Campo, obterClassesControle, obterIdErro } from "../Campo/Campo";
import styles from "./Select.module.css";

export interface Opcao<Valor extends string = string> {
  valor: Valor;
  rotulo: string;
}

interface PropriedadesSelect<Valor extends string> {
  opcoes: Opcao<Valor>[];
  valor: Valor | null;
  aoAlterar: (valor: Valor | null) => void;
  rotulo?: string;
  rotuloAcessivel?: string;
  textoVazio?: string;
  permiteLimpar?: boolean;
  obrigatorio?: boolean;
  erro?: string;
  destacado?: boolean;
  compacto?: boolean;
}

interface ItemLista<Valor extends string> {
  valor: Valor | null;
  rotulo: string;
}

export function Select<Valor extends string>({
  opcoes,
  valor,
  aoAlterar,
  rotulo,
  rotuloAcessivel,
  textoVazio = "Selecionar",
  permiteLimpar = false,
  obrigatorio,
  erro,
  destacado,
  compacto,
}: PropriedadesSelect<Valor>) {
  const idControle = useId();
  const idLista = `${idControle}-lista`;
  const referenciaSeletor = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);

  const itens = useMemo<ItemLista<Valor>[]>(
    () => (permiteLimpar ? [{ valor: null, rotulo: textoVazio }, ...opcoes] : opcoes),
    [opcoes, permiteLimpar, textoVazio],
  );

  const opcaoSelecionada = opcoes.find((opcao) => opcao.valor === valor);
  const obterIdOpcao = (indice: number) => `${idControle}-opcao-${indice}`;

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function fecharAoClicarFora(evento: PointerEvent) {
      if (!referenciaSeletor.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("pointerdown", fecharAoClicarFora);
    return () => document.removeEventListener("pointerdown", fecharAoClicarFora);
  }, [aberto]);

  useEffect(() => {
    if (aberto && indiceAtivo >= 0) {
      document.getElementById(`${idControle}-opcao-${indiceAtivo}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [aberto, indiceAtivo, idControle]);

  function abrir() {
    const indiceSelecionado = itens.findIndex((item) => item.valor === valor);
    setIndiceAtivo(Math.max(indiceSelecionado, 0));
    setAberto(true);
  }

  function selecionar(indice: number) {
    const item = itens[indice];

    if (item) {
      aoAlterar(item.valor);
    }

    setAberto(false);
  }

  function moverPara(indice: number) {
    setIndiceAtivo(Math.min(Math.max(indice, 0), itens.length - 1));
  }

  function moverParaLetra(letra: string) {
    const indiceEncontrado = itens.findIndex((item) => item.rotulo.toLowerCase().startsWith(letra.toLowerCase()));

    if (indiceEncontrado >= 0) {
      setIndiceAtivo(indiceEncontrado);
    }
  }

  function tratarTeclado(evento: KeyboardEvent<HTMLButtonElement>) {
    const teclasDeAbertura = ["ArrowDown", "ArrowUp", "Enter", " "];

    if (!aberto) {
      if (teclasDeAbertura.includes(evento.key)) {
        evento.preventDefault();
        abrir();
      }
      return;
    }

    switch (evento.key) {
      case "ArrowDown":
        evento.preventDefault();
        moverPara(indiceAtivo + 1);
        break;
      case "ArrowUp":
        evento.preventDefault();
        moverPara(indiceAtivo - 1);
        break;
      case "Home":
        evento.preventDefault();
        moverPara(0);
        break;
      case "End":
        evento.preventDefault();
        moverPara(itens.length - 1);
        break;
      case "Enter":
      case " ":
        evento.preventDefault();
        selecionar(indiceAtivo);
        break;
      case "Escape":
        evento.preventDefault();
        setAberto(false);
        break;
      case "Tab":
        setAberto(false);
        break;
      default:
        if (evento.key.length === 1) {
          moverParaLetra(evento.key);
        }
    }
  }

  const gatilho = (
    <div ref={referenciaSeletor} className={styles.seletor}>
      <button
        type="button"
        id={idControle}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={idLista}
        aria-activedescendant={aberto && indiceAtivo >= 0 ? obterIdOpcao(indiceAtivo) : undefined}
        aria-label={rotulo ? undefined : rotuloAcessivel}
        aria-invalid={Boolean(erro)}
        aria-required={obrigatorio}
        aria-describedby={erro ? obterIdErro(idControle) : undefined}
        className={obterClassesControle(erro, destacado, juntarClasses(styles.gatilho, compacto && styles.compacto))}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={tratarTeclado}
      >
        <span className={juntarClasses(styles.valor, !opcaoSelecionada && styles.vazio)}>
          {opcaoSelecionada?.rotulo ?? textoVazio}
        </span>
        <svg
          className={juntarClasses(styles.seta, aberto && styles.setaAberta)}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2 4.5l4 4 4-4" />
        </svg>
      </button>

      {aberto && (
        <ul id={idLista} role="listbox" aria-label={rotulo ?? rotuloAcessivel} className={styles.lista}>
          {itens.map((item, indice) => {
            const selecionada = item.valor === valor || (item.valor === null && !opcaoSelecionada);

            return (
              <li
                key={item.valor ?? "vazio"}
                id={obterIdOpcao(indice)}
                role="option"
                aria-selected={selecionada}
                className={juntarClasses(
                  styles.opcao,
                  indice === indiceAtivo && styles.opcaoAtiva,
                  selecionada && item.valor !== null && styles.opcaoSelecionada,
                )}
                onPointerEnter={() => setIndiceAtivo(indice)}
                onClick={() => selecionar(indice)}
              >
                {item.rotulo}
                {selecionada && item.valor !== null && (
                  <svg className={styles.marca} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 7.5l3 3 6-7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  if (!rotulo) {
    return gatilho;
  }

  return (
    <Campo rotulo={rotulo} idControle={idControle} obrigatorio={obrigatorio} erro={erro}>
      {gatilho}
    </Campo>
  );
}
