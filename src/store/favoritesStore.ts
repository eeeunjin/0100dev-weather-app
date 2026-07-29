import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (cityId: string) => void;
  isFavorite: (cityId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (cityId) => {
        const { favoriteIds } = get();
        set({
          favoriteIds: favoriteIds.includes(cityId)
            ? favoriteIds.filter((id) => id !== cityId)
            : [...favoriteIds, cityId],
        });
      },
      isFavorite: (cityId) => get().favoriteIds.includes(cityId),
    }),
    { name: "weather-app-favorites", skipHydration: true },
  ),
);
