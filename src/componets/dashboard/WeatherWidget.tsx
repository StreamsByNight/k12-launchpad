import {
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets,
  Thermometer, MapPin, CloudDrizzle, CloudFog, Eye
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

function WeatherIcon({ code, isDay, size = "md" }: { code: number; isDay: boolean; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-4 h-4" : "w-6 h-6";

  if (code === 0 && isDay) return <Sun className={`${sz} text-yellow-400`} />;
  if (code === 0 && !isDay) return <Moon className={`${sz} text-slate-300`} />;
  if (code <= 2 && isDay) return <Sun className={`${sz} text-yellow-400`} />;
  if (code <= 2 && !isDay) return <Moon className={`${sz} text-slate-300`} />;
  if (code === 3) return <Cloud className={`${sz} text-slate-400`} />;
  if (code <= 48) return <CloudFog className={`${sz} text-slate-400`} />;
  if (code <= 55) return <CloudDrizzle className={`${sz} text-blue-400`} />;
  if (code <= 67) return <CloudRain className={`${sz} text-blue-400`} />;
  if (code <= 77) return <CloudSnow className={`${sz} text-sky-300`} />;
  if (code <= 82) return <CloudRain className={`${sz} text-blue-500`} />;
  return <CloudLightning className={`${sz} text-yellow-500`} />;
}

function getBgGradient(code: number, isDay: boolean) {
  if (!isDay) return "from-slate-800 to-slate-900";
  if (code === 0 || code <= 2) return "from-sky-400 to-blue-600";
  if (code === 3) return "from-slate-400 to-slate-600";
  if (code <= 48) return "from-slate-400 to-slate-500";
  if (code <= 67) return "from-slate-500 to-blue-700";
  if (code <= 77) return "from-sky-300 to-slate-400";
  return "from-slate-500 to-slate-700";
}

export default function WeatherWidget() {
  const { weather, status } = useWeather();

  if (status === "loading" || status === "idle") {
    return (
      <div className="rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 p-4 h-full min-h-[140px] animate-pulse flex items-center justify-center">
        <p className="text-white/70 text-xs">Loading weather…</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 p-4 h-full min-h-[140px] flex flex-col items-center justify-center gap-2">
        <Eye className="w-6 h-6 text-white/60" />
        <p className="text-white/80 text-xs text-center">Location access denied</p>
      </div>
    );
  }

  if (status === "error" || !weather) {
    return (
      <div className="rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 p-4 h-full min-h-[140px] flex flex-col items-center justify-center gap-2">
        <Cloud className="w-6 h-6 text-white/60" />
        <p className="text-white/80 text-xs text-center">Weather unavailable</p>
      </div>
    );
  }

  const bg = getBgGradient(weather.conditionCode, weather.isDay);

  return (
    <div className={`rounded-lg bg-gradient-to-br ${bg} p-4 h-full min-h-[140px] flex flex-col justify-between shadow-card`}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-white/70" />
            <span className="text-white/80 text-xs font-medium">{weather.city}</span>
          </div>
          <p className="text-4xl font-bold text-white leading-none">{weather.temp}°F</p>
          <p className="text-white/80 text-sm mt-1">{weather.condition}</p>
        </div>
        <WeatherIcon code={weather.conditionCode} isDay={weather.isDay} size="lg" />
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <Thermometer className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white/70 text-xs">Feels {weather.feelsLike}°</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white/70 text-xs">{weather.windSpeed} mph</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white/70 text-xs">{weather.isDay ? "Daytime" : "Nighttime"}</span>
        </div>
      </div>
    </div>
  );
}
