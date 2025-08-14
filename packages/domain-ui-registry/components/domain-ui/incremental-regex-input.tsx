"use client";

import type * as React from "react";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import { useIncrementalRegex } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

/**
 * Incremental Regex Input Component
 * 
 * A text input that validates against a regex pattern in real-time,
 * using NFA-based incremental matching to support complex patterns
 * with alternation, groups, and quantifiers.
 * 
 * Features:
 * - Accepts partial input that could eventually match
 * - Rejects invalid characters immediately
 * - Works with any JavaScript RegExp
 * - Supports controlled and uncontrolled usage
 */

export interface IncrementalRegexInputProps extends React.ComponentProps<"input"> {
  regex: RegExp;
}

export function IncrementalRegexInput({
  regex,
  value,
  onChange,
  ...props
}: IncrementalRegexInputProps) {
  const { 
    value: displayValue, 
    onChange: handleChange,
    isValid
  } = useIncrementalRegex({
    regex,
    value: value as string | undefined,
    onChange: onChange
      ? (newValue: string) => {
          // Create synthetic event for compatibility
          const syntheticEvent = {
            target: { value: newValue },
            currentTarget: { value: newValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      : undefined,
  });

  return (
    <Input 
      {...props} 
      value={displayValue} 
      onChange={handleChange}
      data-valid={isValid}
    />
  );
}