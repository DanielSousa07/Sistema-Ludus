import { FilterButtons } from "@/src/components/Home/FilterButtons";
import { Header } from "@/src/components/Home/Header";
import { HomeCard } from "@/src/components/Home/HomeCard";
import SearchBar from "@/src/components/Home/SearchBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import HomeBackground from "../../components/Home/HomeBackground";

export default function HomeScreen() {
    const router = useRouter()
    const {user} = useAuth()
    return (
        <ScrollView>
            <HomeBackground/>
            <Header/>
            {user?.role === 'ADMIN' && (
      <TouchableOpacity  
        onPress={() => router.push("/admin/manage")}
      >
        <Ionicons name="construct" size={24} color="white" />
        <Text>Gerenciar Ludus</Text>
      </TouchableOpacity>
    )}
            <SearchBar/>
            <FilterButtons/>
            <HomeCard/>
        </ScrollView>
    )
}