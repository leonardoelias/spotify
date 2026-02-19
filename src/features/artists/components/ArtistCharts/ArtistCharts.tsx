import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { Track } from "@/entities/track";

interface ArtistChartsProps {
  tracks: Track[];
  artistName: string;
}

const COLORS = {
  primary: "#34D399",
  secondary: "#2CC08D",
  accent: "#1C1C1E",
  bars: ["#34D399", "#2CC08D", "#10B981", "#059669", "#047857"],
  pie: ["#34D399", "#2CC08D", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
};

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type DurationCategory = "veryShort" | "short" | "medium" | "long" | "veryLong";

function getDurationCategory(ms: number): DurationCategory {
  const minutes = ms / 60000;
  if (minutes < 2) return "veryShort";
  if (minutes < 3) return "short";
  if (minutes < 4) return "medium";
  if (minutes < 5) return "long";
  return "veryLong";
}

const durationTranslationKeys: Record<
  DurationCategory,
  | "charts.duration.veryShort"
  | "charts.duration.short"
  | "charts.duration.medium"
  | "charts.duration.long"
  | "charts.duration.veryLong"
> = {
  veryShort: "charts.duration.veryShort",
  short: "charts.duration.short",
  medium: "charts.duration.medium",
  long: "charts.duration.long",
  veryLong: "charts.duration.veryLong",
};

function CustomBarTooltip({
  active,
  payload,
  popularityLabel,
}: {
  active?: boolean;
  popularityLabel?: string;
  payload?: {
    payload: { fullName: string; popularity: number; position: number };
  }[];
}) {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-elevated border border-border-subtle rounded-xl p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{data.fullName}</p>
        <p className="text-text-secondary text-xs">
          #{data.position} · {popularityLabel}: {data.popularity}
        </p>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({
  active,
  payload,
  tracksLabel,
}: {
  active?: boolean;
  tracksLabel?: string;
  payload?: { name: string; value: number }[];
}) {
  if (active && payload?.length) {
    return (
      <div className="bg-elevated border border-border-subtle rounded-xl p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{payload[0].name}</p>
        <p className="text-text-secondary text-xs">
          {payload[0].value} {tracksLabel}
        </p>
      </div>
    );
  }
  return null;
}

export function ArtistCharts({ tracks, artistName }: ArtistChartsProps) {
  const { t } = useTranslation();

  if (!tracks.length) {
    return null;
  }

  const popularityData = tracks.slice(0, 10).map((track, index) => ({
    name: track.name.length > 15 ? `${track.name.slice(0, 15)}...` : track.name,
    fullName: track.name,
    popularity: track.popularity,
    position: index + 1,
  }));

  const durationCategories = tracks.reduce(
    (acc, track) => {
      const category = getDurationCategory(track.duration_ms);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<DurationCategory, number>,
  );

  const durationData = Object.entries(durationCategories).map(
    ([key, value]) => ({
      name: t(durationTranslationKeys[key as DurationCategory]),
      value,
      key,
    }),
  );

  const avgPopularity = Math.round(
    tracks.reduce((sum, track) => sum + track.popularity, 0) / tracks.length,
  );
  const avgDuration = Math.round(
    tracks.reduce((sum, track) => sum + track.duration_ms, 0) / tracks.length,
  );
  const explicitCount = tracks.filter((track) => track.explicit).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {t("charts.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("charts.subtitle", { artist: artistName })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={t("charts.stats.avgPopularity")}
          value={`${avgPopularity}%`}
        />
        <StatCard
          label={t("charts.stats.avgDuration")}
          value={formatDuration(avgDuration)}
        />
        <StatCard
          label={t("charts.stats.totalTracks")}
          value={tracks.length.toString()}
        />
        <StatCard
          label={t("charts.stats.explicitTracks")}
          value={`${explicitCount}/${tracks.length}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">
            {t("charts.popularityTitle")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularityData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#636366"
                  tick={{ fill: "#8E8E93", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  stroke="#636366"
                  tick={{ fill: "#8E8E93", fontSize: 11 }}
                />
                <Tooltip content={<CustomBarTooltip popularityLabel={t("charts.popularity")} />} />
                <Bar
                  dataKey="popularity"
                  fill={COLORS.primary}
                  radius={[0, 6, 6, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">
            {t("charts.durationTitle")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={durationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {durationData.map((entry, index) => (
                    <Cell
                      key={entry.key}
                      fill={COLORS.pie[index % COLORS.pie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip tracksLabel={t("charts.tracks")} />} />
                <Legend
                  wrapperStyle={{ color: "#8E8E93" }}
                  formatter={(value) => (
                    <span className="text-text-secondary text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-text-secondary text-xs">{label}</p>
          <p className="text-white text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
