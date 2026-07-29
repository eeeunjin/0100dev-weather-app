"use client";

import Link from "next/link";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getWeatherLabel } from "@/lib/constants";
import { useFavoritesStore } from "@/store/favoritesStore";
import { CityCurrentWeather } from "@/types/weather";

export function CityCard({ city, current }: CityCurrentWeather) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(city.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <Card className="transition hover:shadow-md">
      <CardContent className="flex items-center justify-between">
        <Link
          href={`/city/${city.id}`}
          className="flex flex-1 flex-col gap-1"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{city.name}</h2>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {getWeatherLabel(current.weatherCode)}
            </Badge>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>기온 {Math.round(current.temperature)}°C</span>
            <span>습도 {current.humidity}%</span>
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isFavorite ? "관심 도시 해제" : "관심 도시 등록"}
          onClick={() => toggleFavorite(city.id)}
          className="shrink-0 text-primary"
        >
          {isFavorite ? (
            <StarFilledIcon className="size-5" />
          ) : (
            <StarIcon className="size-5" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
