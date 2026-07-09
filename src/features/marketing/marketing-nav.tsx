import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-accent" />
          <span className="text-[15px] font-light tracking-tight text-foreground">ShadoPay</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link href="/solutions" className="transition-colors hover:text-foreground">Solutions</Link>
          <Link href="/developers" className="transition-colors hover:text-foreground">Developers</Link>
          <Link href="/security" className="transition-colors hover:text-foreground">Security</Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link href="/docs" className="transition-colors hover:text-foreground">Documentation</Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 transition-colors hover:text-foreground">
                Company <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild><Link href="/about">About</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/trust">Trust Centre</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/status">Status</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/careers">Careers</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/partners">Partners</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/contact">Contact</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-8 rounded-sm px-3 text-xs bg-accent text-accent-foreground shadow-soft hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
