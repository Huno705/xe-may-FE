export function formatPrice(value) {
  const number = Number(value) || 0;
  if (number === 0) return "Miễn phí";
  return number.toLocaleString("vi-VN") + " ₫";
}
