"use client";

import { useState, useCallback, useMemo } from "react";
import { validateIncrementalInput, matches } from "../lib/incremental-regex";

/**
 * React Hook for Incremental Regex Input Validation
 *
 * Provides real-time regex validation that:
 * - Accepts partial input that could eventually match
 * - Rejects characters that make matching impossible
 * - Works with any JavaScript RegExp, including complex alternation patterns
 *
 * Uses NFA-based incremental matching for proper regex support.
 */

export interface UseIncrementalRegexProps {
  regex: RegExp;
  value?: string;
  onChange?: (value: string) => void;
}

export interface UseIncrementalRegexReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

export const useIncrementalRegex = ({
  regex,
  value: controlledValue,
  onChange,
}: UseIncrementalRegexProps): UseIncrementalRegexReturn => {
  const [uncontrolledValue, setUncontrolledValue] = useState("");

  // Use controlled value if provided, otherwise use internal state
  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // Check if current value fully matches the regex
  const isValid = useMemo(() => {
    return matches(value, regex);
  }, [value, regex]);

  // Handle input changes with incremental validation
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Validate input incrementally - keep only valid prefix
      const validatedValue = validateIncrementalInput(newValue, regex);

      // Update state if uncontrolled
      if (controlledValue === undefined) {
        setUncontrolledValue(validatedValue);
      }

      // Call onChange callback with validated value
      if (onChange) {
        onChange(validatedValue);
      }
    },
    [regex, controlledValue, onChange]
  );

  return {
    value,
    onChange: handleChange,
    isValid,
  };
};
