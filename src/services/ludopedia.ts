export type LudopediaGame = {
  id: number;
  name: string;
  image: string;
};

export async function getOnboardingGames(): Promise<LudopediaGame[]> {
  // Simula delay de API (UX real)
  await new Promise((r) => setTimeout(r, 400));

  return [
    {
      id: 1,
      name: "Catan",
      image:
        "https://ludopedia-postagem.nyc3.cdn.digitaloceanspaces.com/f55a6_qee8sr.jpg",
    },
    {
      id: 2,
      name: "Coup",
      image:
        "https://storage.googleapis.com/ludopedia-capas/460_m.jpg",
    },
    {
      id: 3,
      name: "Bang!",
      image:
        "https://67287.cdn.simplo7.net/static/67287/sku/jogos-de-tabuleiro-e-cardgames-bang-dice-game--p-1624998437343.jpg",
    },
    {
      id: 4,
      name: "Superlemming",
      image:
        "https://67287.cdn.simplo7.net/static/67287/sku/jogos-de-tabuleiro-e-cardgames-jogo-superlemming-p-1720034538156.jpg",
    },
  ];
}
