export interface OnboardingStep {
  number: number;
  slug: string;
  label: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { number: 1, slug: "welcome", label: "Welcome" },
  { number: 2, slug: "business", label: "Business information" },
  { number: 3, slug: "category", label: "Category" },
  { number: 4, slug: "verification", label: "Verification" },
  { number: 5, slug: "payout", label: "Payout preferences" },
  { number: 6, slug: "branding", label: "Branding" },
  { number: 7, slug: "complete", label: "Complete" },
];

export function stepBySlug(slug: string) {
  return ONBOARDING_STEPS.find((s) => s.slug === slug);
}

export function stepByNumber(number: number) {
  return ONBOARDING_STEPS.find((s) => s.number === number) ?? ONBOARDING_STEPS[0];
}

export function nextStepSlug(currentNumber: number) {
  return stepByNumber(Math.min(currentNumber + 1, ONBOARDING_STEPS.length)).slug;
}
