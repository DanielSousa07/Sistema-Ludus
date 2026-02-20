import React, { createContext, useContext, useMemo, useState } from "react";

export type FilterValues = {
    status: "ALL" | "AVAILABLE" | "RESERVED" | "RENTED";
    players: number | null; 
    age: number | null;
    stars: number[]
    priceMin: number;
    priceMax: number;
    timeMax: number;
};

const DEFAULT_FILTERS: FilterValues = {
    status: "ALL",
    players: null,
    age: null,
    stars: [],
    priceMin: 0,
    priceMax: 100,
    timeMax: 60
};

type FilterContextValue = {
    filters: FilterValues;
    setFilters: (next: FilterValues) => void;
    resetFilters: () => void;
    activeCount: number;
    isDefault: boolean;
};

const FiltersContext = createContext<FilterContextValue>({} as FilterContextValue);

function countActive(filters: FilterValues) {
    let n = 0

    if ( filters.status !==  DEFAULT_FILTERS.status) n++;
    if ( filters.players !==  DEFAULT_FILTERS.players) n++;
    if ( filters.age !==  DEFAULT_FILTERS.age) n++;
    if ( filters.stars.length > 0) n++;
    if ( filters.priceMin !==  DEFAULT_FILTERS.priceMin || filters.priceMax !== DEFAULT_FILTERS.priceMax) n++;
    if ( filters.timeMax !==  DEFAULT_FILTERS.timeMax) n++;
    
    return n;
};

export function FilterProvider({children}: {children: React.ReactNode }) {
    const [filters, setFiltersStates] = useState<FilterValues>(DEFAULT_FILTERS);

    const value = useMemo(() => {
        const activeCount = countActive(filters);
        return {
            filters,
            setFilters: (next: FilterValues) => setFiltersStates(next),
            resetFilters: () => setFiltersStates(DEFAULT_FILTERS),
            activeCount,
            isDefault: activeCount === 0, 
        };
    }, [filters])

    return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
    return useContext(FiltersContext);
};

export const DEFAULTS = DEFAULT_FILTERS
