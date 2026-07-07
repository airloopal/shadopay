import {
  Code2,
  Video,
  Repeat,
  Briefcase,
  ShoppingBag,
  Plane,
  Building2,
  Pill,
  Dice5,
  Flame,
  Cannabis,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface OnboardingCategory {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const ONBOARDING_CATEGORIES: OnboardingCategory[] = [
  { value: "Digital Services", label: "Digital Services", icon: Code2 },
  { value: "Content Creator", label: "Content Creator", icon: Video },
  { value: "Subscription Platform", label: "Subscription Platform", icon: Repeat },
  { value: "Professional Services", label: "Professional Services", icon: Briefcase },
  { value: "E-commerce", label: "E-commerce", icon: ShoppingBag },
  { value: "Travel", label: "Travel", icon: Plane },
  { value: "Hospitality", label: "Hospitality", icon: Building2 },
  { value: "Nutraceuticals & Supplements", label: "Nutraceuticals & Supplements", icon: Pill },
  { value: "iGaming & Fantasy Sports", label: "iGaming & Fantasy Sports", icon: Dice5 },
  { value: "Adult Content & Entertainment", label: "Adult Content & Entertainment", icon: Flame },
  { value: "CBD & Wellness", label: "CBD & Wellness", icon: Cannabis },
  { value: "Other", label: "Other", icon: MoreHorizontal },
];
