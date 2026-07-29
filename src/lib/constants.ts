import { City } from "@/types/weather";

export const CITIES: City[] = [
  { id: "seoul", name: "서울", lat: 37.5665, lon: 126.978 },
  { id: "busan", name: "부산", lat: 35.1796, lon: 129.0756 },
  { id: "incheon", name: "인천", lat: 37.4563, lon: 126.7052 },
  { id: "daegu", name: "대구", lat: 35.8714, lon: 128.6014 },
  { id: "cheongju", name: "청주", lat: 36.6424, lon: 127.489 },
];

export const WEATHER: Record<number, string> = {
  0: "맑음 ☀️",
  1: "대체로 맑음 🌤️",
  2: "구름 조금 ⛅",
  3: "흐림 ☁️",
  45: "안개 🌫️",
  48: "짙은 안개 🌫️",
  51: "약한 이슬비 🌦️",
  53: "이슬비 🌦️",
  55: "강한 이슬비 🌧️",
  61: "약한 비 🌧️",
  63: "비 🌧️",
  65: "강한 비 ⛈️",
  71: "약한 눈 🌨️",
  73: "눈 🌨️",
  75: "강한 눈 ❄️",
  80: "소나기 🌦️",
  81: "소나기 🌧️",
  82: "강한 소나기 ⛈️",
  95: "천둥번개 ⛈️",
  96: "우박 동반 뇌우 ⛈️",
};

export function getWeatherLabel(code: number): string {
  return WEATHER[code] ?? "정보 없음";
}

export function getCityById(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}
