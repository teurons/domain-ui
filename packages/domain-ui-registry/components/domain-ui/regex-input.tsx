"use client";

import type * as React from "react";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import { useIncrementalRegex } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export interface RegexInputProps
  extends Omit<React.ComponentProps<"input">, "defaultValue"> {
  regex: RegExp;
  defaultValue?: string;
  onValidationChange?: (
    state: "valid" | "potentially-valid" | "invalid",
    errorType: "incomplete" | "invalid-format" | "incorrect-input" | null
  ) => void;
}

export function RegexInput({
  regex,
  value,
  onChange,
  onValidationChange,
  defaultValue,
  ...props
}: RegexInputProps) {
  const {
    value: displayValue,
    onChange: handleChange,
    onPaste: handlePaste,
  } = useIncrementalRegex({
    regex,
    value: value as string | undefined,
    onChange: onChange
      ? (newValue: string) => {
          const syntheticEvent = {
            target: { value: newValue },
            currentTarget: { value: newValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      : undefined,
    onValidationChange,
    defaultValue,
  });

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      onPaste={handlePaste}
    />
  );
}
