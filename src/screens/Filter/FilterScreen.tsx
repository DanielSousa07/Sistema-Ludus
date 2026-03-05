import FilterBackground from "@/src/components/Filter/FilterBackgroud";
import { FilterCard } from "@/src/components/Filter/FilterCard";
import { FilterValues, useFilters } from "@/src/contexts/FiltersContext";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function FilterScreen() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();

  function handleApplyFilters(nextFilters: FilterValues) {
    setFilters(nextFilters);

    router.replace({
      pathname: "/search",
      params: {
        ...nextFilters,
        
        stars: nextFilters.stars.join(","),
      } as any,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <FilterBackground />
      <FilterCard onApply={handleApplyFilters} initialValues={filters} />
    </View>
  );
}