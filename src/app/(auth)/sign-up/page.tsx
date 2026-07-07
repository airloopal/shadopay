import Link from "next/link";
import { SignUpForm } from "@/features/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-9 w-9 rounded-md bg-accent" />
          <h1 className="text-2xl font-light text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start your merchant application. Verification happens after sign-up.
          </p>
        </div>

        <SignUpForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
