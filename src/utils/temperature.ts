/** Celsius → Fahrenheit, rounded for display */
export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/** e.g. 22°C / 72°F */
export function formatTempPair(c: number): string {
  const rounded = Math.round(c);
  return `${rounded}°C / ${cToF(rounded)}°F`;
}

/** High and low with both units */
export function formatHighLowPair(highC: number, lowC: number): string {
  const hi = Math.round(highC);
  const lo = Math.round(lowC);
  return `High ${hi}°C (${cToF(hi)}°F) · Low ${lo}°C (${cToF(lo)}°F)`;
}
