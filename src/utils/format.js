export function formatPrice(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("vi-VN") + " ₫";
}
