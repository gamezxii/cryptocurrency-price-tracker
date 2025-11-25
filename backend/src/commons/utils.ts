export function formatCryptoName(name: string | undefined): string {
  if (!name) return 'unknown';
  return name.trim().toLowerCase().replace(/\s+/g, '');
}
