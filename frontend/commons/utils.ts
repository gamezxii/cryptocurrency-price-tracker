export const formatCryptoPrice = (value: string | number): string => {
  const str = String(value);

  if (!str.includes(".")) {
    return Number(str).toLocaleString("en-US");
  }

  const [int, dec] = str.split(".");

  const trimmed = dec.replace(/0+$/, "");

  const intFormatted = Number(int).toLocaleString("en-US");

  if (trimmed.length === 0) {
    return `${intFormatted}.${dec.slice(0, 2)}`;
  }

  return `${intFormatted}.${trimmed.slice(0, 8)}`;
};
