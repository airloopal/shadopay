"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Wraps route content with a refined, subtle transition — a small fade + rise,
 * never a flashy slide or bounce. Keyed on pathname so it re-triggers on
 * navigation between sections.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
