import { FlatList } from "react-native";
import GameCardHorizontal from "./GameCardHorizontal";

interface ForYouGame {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
}

const data: ForYouGame[] = [
  {
    id: "1",
    title: "Catan",
    price: "R$30",
    rating: 4.9,
    image: "https://xboxwire.thesourcemediaassets.com/sites/2/2022/10/CATAN-Console-Edition-Key-Art-dd3e1d28c3058d5d737a.jpg",
  },
  {
    id: "2",
    title: "Coup",
    price: "R$30",
    rating: 5.0,
    image: "https://storage.googleapis.com/ludopedia-capas/460_m.jpg",
  },
];

export default function GameCarousel() {
    return (
        <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({item})=> (
                <GameCardHorizontal {...item}/>
            ) }
        />
    )
}