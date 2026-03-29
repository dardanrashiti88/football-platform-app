const moneyFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatMoney = (value: number) =>
  `$${moneyFormatter.format(Math.max(0, Math.round(value || 0)))}`;

