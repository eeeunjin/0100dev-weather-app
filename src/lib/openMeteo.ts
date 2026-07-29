import { City, CurrentWeather, DailyForecastDay } from "@/types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

interface CurrentWeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
}

interface DailyForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    relative_humidity_2m_mean: number[];
  };
}

export async function fetchCurrentWeather(
  city: City,
): Promise<CurrentWeather> {
  const url = `${BASE_URL}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia/Seoul`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`${city.name} 날씨 조회 실패`);
  }

  const data: CurrentWeatherResponse = await res.json();

  return {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
  };
}

export async function fetchWeeklyForecast(
  city: City,
): Promise<DailyForecastDay[]> {
  const url = `${BASE_URL}?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_mean&timezone=Asia/Seoul`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`${city.name} 주간 예보 조회 실패`);
  }

  const data: DailyForecastResponse = await res.json();

  return data.daily.time.map((date, index) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[index],
    minTemp: data.daily.temperature_2m_min[index],
    humidity: data.daily.relative_humidity_2m_mean[index],
    weatherCode: data.daily.weather_code[index],
  }));
}
