export function formatCurrency(usdCents: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(parseFloat(usdCents));
}

export function truncateBalance(balance: string) {
  const truncatedBalance =
    balance.split(".")[0] + "." + (balance.split(".")[1]?.slice(0, 6) ?? "00");
  return truncatedBalance;
}
