export const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

