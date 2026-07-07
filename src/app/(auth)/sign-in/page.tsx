import Link from "next/link";
import { SignInForm } from "@/features/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-9 w-9 rounded-md bg-accent" />
          <h1 className="text-2xl font-light text-foreground">Sign in to ShadoPay</h1>
          <p className="text-sm text-muted-foreground">Access your merchant dashboard</p>
        </div>

        <SignInForm />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-accent hover:underline">
            Apply as a merchant
          </Link>
        </p>
      </div>
    </div>
  );
}
