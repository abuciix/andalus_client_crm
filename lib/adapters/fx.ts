// STUB rate. Replace with a live source (e.g. National Bank of Ethiopia feed) before
// relying on this for real invoicing — display-time conversion only, never persisted.
const STUB_ETB_TO_USD_RATE = 1 / 130;

export function convertEtbToUsd(amountEtb: number): number {
  return Math.round(amountEtb * STUB_ETB_TO_USD_RATE * 100) / 100;
}
