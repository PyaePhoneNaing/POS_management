export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export function isSameWeek(date1, date2) {
  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday = 0
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const d1Start = startOfWeek(date1);
  const d2Start = startOfWeek(date2);

  return (
    d1Start.getFullYear() === d2Start.getFullYear() &&
    d1Start.getMonth() === d2Start.getMonth() &&
    d1Start.getDate() === d2Start.getDate()
  );
}

export function isSameMonth(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}
export function isSameYear(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}