"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
  durationSeconds?: number;
}

/** Animates from 0 (or the previous value) up to `value`, formatting each frame. */
export function AnimatedCounter({ value, format, className, durationSeconds = 0.9 }: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const hasAnimated = useRef(false);
  const rounded = useTransform(motionValue, (latest) =>
    format ? format(latest) : Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: hasAnimated.current ? durationSeconds : durationSeconds * 1.3,
      ease: [0.16, 1, 0.3, 1],
    });
    hasAnimated.current = true;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
