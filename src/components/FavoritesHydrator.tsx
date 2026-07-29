"use client";

import { useEffect } from "react";
import { useFavoritesStore } from "@/store/favoritesStore";

export function FavoritesHydrator() {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
  }, []);

  return null;
}
