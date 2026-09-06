export function formatPrice(value) {
  const number = Number(value) || 0;
  if (number === 0) return "0 ₫";
  return number.toLocaleString("vi-VN") + " ₫";
}

export function sanitizeCurrencyInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.replace(/^0+(?=\d)/, "");
}

export function formatCurrencyInput(value) {
  return sanitizeCurrencyInput(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
