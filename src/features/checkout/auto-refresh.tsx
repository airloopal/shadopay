"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ seconds = 3 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.refresh(), seconds * 1000);
    return () => clearTimeout(timer);
  }, [router, seconds]);

  return null;
}
