import { FlatList } from "react-native";
import GameCardHorizontal from "./GameCardHorizontal";

interface ForYouGame {
  id: string;
  title: string;
  price: number;
  rating?: number;

  cover: string;
}


export default function GameCarousel({data}: {data: ForYouGame[]}) {
    return (
        <FlatList
            data={data}
          horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({item})=> (
                <GameCardHorizontal 
                  title={item.title}
                  price={`R$ ${item.price}`}
                  image={item.cover} // Mapeia 'cover' para a imagem do card
                  rating={item.rating || 5.0} // Valor padrão caso não tenha nota ainda
                />
            ) }
        />
    )
}