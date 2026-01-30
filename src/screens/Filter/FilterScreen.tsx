import FilterBackground from "@/src/components/Filter/FilterBackgroud";
import { FilterCard } from "@/src/components/Filter/FilterCard";
import BackButton from "@/src/components/common/BackButton";
import { View } from "react-native";

export default function FilterScreen() {
    function handleApplyFilters() {
  console.log("Filtros aplicados");
}
    return (
        <View style={{flex: 1}}>
            <FilterBackground/>
                <FilterCard onApply={handleApplyFilters}/>
            <BackButton/>
        </View>
    )
}