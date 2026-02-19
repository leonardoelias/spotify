export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatNumber(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatDate(
  dateString: string,
  locale = "pt-BR",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

export function formatDateShort(dateString: string, locale = "pt-BR"): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  }).format(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function getAlbumTypeLabel(type: string, locale = "pt-BR"): string {
  const labels: Record<string, Record<string, string>> = {
    "pt-BR": {
      album: "Álbum",
      single: "Single",
      compilation: "Compilação",
    },
    "en-US": {
      album: "Album",
      single: "Single",
      compilation: "Compilation",
    },
  };

  return labels[locale]?.[type] || type;
}
