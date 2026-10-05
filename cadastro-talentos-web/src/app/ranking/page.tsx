import type { Metadata } from "next";
import { RankingCandidatos } from "@/features/candidatos/components/Ranking/RankingCandidatos";

export const metadata: Metadata = { title: "Ranking" };

export default function PaginaRanking() {
  return <RankingCandidatos />;
}
