/**
 * Sandbox fee model. Mirrors the "Starter" rate shown on the public Pricing
 * page (2.9% + $0.30) so numbers are consistent across the product. This is
 * a simulation for the internal payments engine — no real processor fee
 * schedule is wired up yet.
 */
const PERCENTAGE_RATE = 0.029;
const FIXED_FEE = 0.3;

export function calculateFee(amount: number): number {
  return Math.round((amount * PERCENTAGE_RATE + FIXED_FEE) * 100) / 100;
}

export function calculateNetAmount(amount: number, fee: number): number {
  return Math.round((amount - fee) * 100) / 100;
}

/** Splits a net amount into the portion held in reserve vs. released to pending, per the merchant's reserve percentage. */
export function splitReserve(netAmount: number, reservePercentage: number) {
  const reserveAmount = Math.round(netAmount * (reservePercentage / 100) * 100) / 100;
  const pendingAmount = Math.round((netAmount - reserveAmount) * 100) / 100;
  return { reserveAmount, pendingAmount };
}
