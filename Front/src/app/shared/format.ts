/** `yyyy-MM-dd` vers `dd/MM/yyyy`, sans passer par Date (pas de décalage de fuseau). */
export function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
