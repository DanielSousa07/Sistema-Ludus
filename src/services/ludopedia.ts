export type LudopediaGame = {
  id: number;
  name: string;
  image: string;
};

export async function getOnboardingGames(): Promise<LudopediaGame[]> {
  // Simula delay de API (UX real)
  await new Promise((r) => setTimeout(r, 200));

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
      name: "Bang! Dice game.",
      image:
        "https://cf.geekdo-images.com/BLTFau1Ue-gjX6geQdYrjQ__opengraph/img/_aLnCfdsmT4DYf3nfxBYv2XKID8=/0x0:1000x525/fit-in/1200x630/filters:strip_icc()/pic2909713.jpg",
    },
    {
      id: 4,
      name: "Superlemming",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNYy9nhTV3hauU4aR2EjDvSnlE6F0h7UYd5w&s",
    },
  ];
}