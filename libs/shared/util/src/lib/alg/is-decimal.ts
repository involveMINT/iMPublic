export function isDecimal(n: number): boolean {
  return n - Math.floor(n) !== 0;
}
