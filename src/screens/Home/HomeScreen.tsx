import { NavFooter } from "@/src/components/common/NavFooter";
import { FilterButtons } from "@/src/components/Home/FilterButtons";
import { Header } from "@/src/components/Home/Header";
import { HomeCard } from "@/src/components/Home/HomeCard";
import SearchBar from "@/src/components/Home/SearchBar";
import { useFilters } from "@/src/contexts/FiltersContext";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import HomeBackground from "../../components/Home/HomeBackground";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("")
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

  const { activeCount } = useFilters();
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 65 }}>
        <HomeBackground />
        <Header />


        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            if (!search.trim()) return;
            Keyboard.dismiss();

            router.push({
              pathname: "/search",
              params: { q: search },
            })
          }}
          activeFiltersCount={activeCount}
        />
        <FilterButtons />
        <HomeCard games={games} />
      </ScrollView>
      <NavFooter />
    </View>
  )
}