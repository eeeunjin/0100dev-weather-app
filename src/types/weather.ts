export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
}

export interface DailyForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  weatherCode: number;
}

export interface CityCurrentWeather {
  city: City;
  current: CurrentWeather;
}
