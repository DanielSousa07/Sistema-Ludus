import FilterBackground from "@/src/components/Filter/FilterBackgroud";
import { FilterCard } from "@/src/components/Filter/FilterCard";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function FilterScreen() {
    const router = useRouter();

    function handleApplyFilters(filters: any) {
    router.push({
        pathname: "/search",
        params: {...filters}
    })
}
    return (
        <View style={{flex: 1}}>
            <FilterBackground/>
           
                <FilterCard onApply={handleApplyFilters}/>
        </View>
    )
}
