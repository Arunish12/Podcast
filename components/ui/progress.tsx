"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, max = 100, ...props }, ref) => {
  // Ensure value and max are valid numbers
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
  const safeMax = typeof max === "number" && max > 0 ? max : 100;

  // Ensure value stays within 0 to max bounds
  const progressPercent = Math.min(Math.max(0, safeValue), safeMax);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-blue-500 transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${(progressPercent / safeMax) * 100}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
