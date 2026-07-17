// Approximate kiremt (Ethiopian rainy season) window. A fixed calendar range is a
// simplification — swap for a real meteorological source if precision matters later.
const KIREMT_START_MONTH_DAY = { month: 6, day: 1 }; // Jun 1
const KIREMT_END_MONTH_DAY = { month: 9, day: 15 }; // Sep 15

export function overlapsKiremt(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined
): boolean {
  if (!startDate && !endDate) return false;
  const start = startDate ?? endDate!;
  const end = endDate ?? startDate!;

  const years = new Set([start.getFullYear(), end.getFullYear()]);
  for (const year of years) {
    const kiremtStart = new Date(year, KIREMT_START_MONTH_DAY.month - 1, KIREMT_START_MONTH_DAY.day);
    const kiremtEnd = new Date(year, KIREMT_END_MONTH_DAY.month - 1, KIREMT_END_MONTH_DAY.day);
    if (start <= kiremtEnd && end >= kiremtStart) return true;
  }
  return false;
}
