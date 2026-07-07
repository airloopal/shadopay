import { Check } from "lucide-react";
import { ONBOARDING_STEPS } from "@/features/onboarding/steps";
import { cn } from "@/lib/utils";

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {ONBOARDING_STEPS.map((step, i) => {
        const isComplete = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        return (
          <div key={step.slug} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors",
                isComplete && "border-accent bg-accent text-accent-foreground",
                isCurrent && "border-accent text-accent",
                !isComplete && !isCurrent && "border-border text-muted-foreground"
              )}
            >
              {isComplete ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : step.number}
            </div>
            <span
              className={cn(
                "hidden text-xs lg:inline",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {i < ONBOARDING_STEPS.length - 1 && (
              <div className={cn("h-px w-4 sm:w-8", isComplete ? "bg-accent" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
