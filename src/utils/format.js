export function formatPrice(value) {
  const number = Number(value) || 0;
  if (number === 0) return "0 ₫";
  return number.toLocaleString("vi-VN") + " ₫";
}
