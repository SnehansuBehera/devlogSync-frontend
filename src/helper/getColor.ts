function getColor(intensity: number) {
  if (intensity === 0) return "bg-gray-200";
  if (intensity <= 2) return "bg-green-100";
  if (intensity <= 5) return "bg-green-400";
  if (intensity <= 10) return "bg-green-600";
  return "bg-green-800";
}
export default getColor;