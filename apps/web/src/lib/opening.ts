// Self-contained so the exact same calculation can run in the tiny inline script.
export function openingCountdown(openingDate: string, timezone = 'America/New_York', now = new Date()) {
  const day = (value: Date) => {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone: timezone, year:'numeric', month:'numeric', day:'numeric'}).formatToParts(value);
    const part = (name: string) => Number(parts.find(p => p.type === name)!.value);
    return Date.UTC(part('year'), part('month') - 1, part('day')) / 86400000;
  };
  // Sanity datetime values are instants; also support a date-only opening field.
  const openingDay = /^\d{4}-\d{2}-\d{2}$/.test(openingDate)
    ? Date.parse(`${openingDate}T00:00:00Z`) / 86400000 : day(new Date(openingDate));
  const days = openingDay - day(now);
  return {days, state:days > 0 ? 'upcoming' : days === 0 ? 'today' : 'open',
    label:days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} to go` : days === 0 ? 'Opens tonight' : 'Now open'};
}
