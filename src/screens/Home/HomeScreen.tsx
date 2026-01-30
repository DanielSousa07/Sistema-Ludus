import { NavFooter } from "@/src/components/common/NavFooter";
import { FilterButtons } from "@/src/components/Home/FilterButtons";
import { Header } from "@/src/components/Home/Header";
import { HomeCard } from "@/src/components/Home/HomeCard";
import SearchBar from "@/src/components/Home/SearchBar";
import { api } from "@/src/services/api";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import HomeBackground from "../../components/Home/HomeBackground";

export default function HomeScreen() {


    const [games, setGames] = useState([])

    useEffect(() => {
      async function loadGames() {
        try {
          const response = await api.get("/games")
          setGames(response.data)
        } catch (error) {
          console.error("Erro ao carregar jogos", error)
        }
      }
      loadGames();
    }, [])
    return (
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 65}}>
              <HomeBackground/>
              <Header/>
              
              <SearchBar/>
              <FilterButtons/>
              <HomeCard games={games} />
          </ScrollView>
            <NavFooter/>
        </View>
    )
}