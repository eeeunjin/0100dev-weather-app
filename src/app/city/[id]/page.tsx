"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCityById, getWeatherLabel } from "@/lib/constants";
import { fetchWeeklyForecast } from "@/lib/openMeteo";
import { useFavoritesStore } from "@/store/favoritesStore";
import { DailyForecastDay } from "@/types/weather";

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export default function CityDetailPage() {
  const params = useParams<{ id: string }>();
  const city = getCityById(params.id);

  const [days, setDays] = useState<DailyForecastDay[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "done">(
    "loading",
  );

  const isFavorite = useFavoritesStore((state) =>
    city ? state.isFavorite(city.id) : false,
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const forecast = await fetchWeeklyForecast(city!);
        if (!cancelled) {
          setDays(forecast);
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
  }, [city]);

  if (!city) {
    return (
      <main className="flex-1 px-4 py-8">
        <p>존재하지 않는 도시입니다.</p>
        <Link href="/" className="mt-4 inline-block text-primary underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeftIcon className="size-4" />
        목록으로
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{city.name} 주간 예보</h1>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isFavorite ? "관심 도시 해제" : "관심 도시 등록"}
          onClick={() => toggleFavorite(city.id)}
          className="text-primary"
        >
          {isFavorite ? (
            <StarFilledIcon className="size-5" />
          ) : (
            <StarIcon className="size-5" />
          )}
        </Button>
      </div>

      {status === "loading" && (
        <p className="mt-8 text-center text-muted-foreground">
          예보를 불러오는 중...
        </p>
      )}

      {status === "error" && (
        <p className="mt-8 text-center text-destructive">
          예보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {status === "done" && (
        <div className="mt-6 flex flex-col gap-3">
          {days.map((day) => (
            <Card key={day.date}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{formatDate(day.date)}</p>
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-accent text-accent-foreground"
                  >
                    {getWeatherLabel(day.weatherCode)}
                  </Badge>
                </div>
                <div className="text-right text-sm">
                  <p>
                    <span className="font-semibold text-primary">
                      {Math.round(day.maxTemp)}°
                    </span>{" "}
                    /{" "}
                    <span className="font-semibold text-muted-foreground">
                      {Math.round(day.minTemp)}°
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    습도 {Math.round(day.humidity)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
