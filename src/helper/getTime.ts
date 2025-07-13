export const getTime = (time: string) => {
  if (!time) return "";

  const date = new Date(time);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  })
    .format(date)
    .replace(",", "")
    .replace(/\//g, ".");
};
