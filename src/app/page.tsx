"use client";

import { useEffect, useState } from "react";
import { CityCard } from "@/components/CityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CITIES } from "@/lib/constants";
import { fetchCurrentWeather } from "@/lib/openMeteo";
import { useFavoritesStore } from "@/store/favoritesStore";
import { CityCurrentWeather } from "@/types/weather";

export default function Home() {
  const [weathers, setWeathers] = useState<CityCurrentWeather[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "done">(
    "loading",
  );
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const results = await Promise.all(
          CITIES.map(async (city) => ({
            city,
            current: await fetchCurrentWeather(city),
          })),
        );
        if (!cancelled) {
          setWeathers(results);
          setStatus("done");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const favorites = weathers.filter((w) => favoriteIds.includes(w.city.id));

  return (
    <main className="flex-1 px-4 py-8">
      <h1 className="text-2xl font-bold">오늘의 날씨</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        도시를 눌러 주간 예보를 확인하고, ☆를 눌러 관심 도시로 저장하세요.
      </p>

      {status === "loading" && (
        <p className="mt-8 text-center text-muted-foreground">
          날씨 정보를 불러오는 중...
        </p>
      )}

      {status === "error" && (
        <p className="mt-8 text-center text-destructive">
          날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {status === "done" && (
        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="all">전체 도시</TabsTrigger>
            <TabsTrigger value="favorites">
              관심 도시 {favorites.length > 0 && `(${favorites.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex flex-col gap-3">
            {weathers.map(({ city, current }) => (
              <CityCard key={city.id} city={city} current={current} />
            ))}
          </TabsContent>

          <TabsContent value="favorites" className="flex flex-col gap-3">
            {favorites.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                아직 관심 도시가 없어요. ☆를 눌러 추가해보세요.
              </p>
            ) : (
              favorites.map(({ city, current }) => (
                <CityCard key={city.id} city={city} current={current} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
