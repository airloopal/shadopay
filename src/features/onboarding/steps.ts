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

const DEFAULT_STEP: OnboardingStep = {
  number: 1,
  slug: "welcome",
  label: "Welcome",
};

export function stepBySlug(slug: string): OnboardingStep {
  return ONBOARDING_STEPS.find((step) => step.slug === slug) ?? DEFAULT_STEP;
}

export function stepByNumber(number: number): OnboardingStep {
  return ONBOARDING_STEPS.find((step) => step.number === number) ?? DEFAULT_STEP;
}

export function nextStepSlug(currentNumber: number): string {
  const nextNumber = Math.min(currentNumber + 1, ONBOARDING_STEPS.length);
  return stepByNumber(nextNumber).slug;
}
