type ValorClasse = string | false | null | undefined;

export function juntarClasses(...classes: ValorClasse[]) {
  return classes.filter(Boolean).join(" ");
}
