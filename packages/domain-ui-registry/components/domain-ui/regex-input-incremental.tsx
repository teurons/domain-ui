"use client";

import type * as React from "react";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import { 
  useIncrementalRegex,
  type ValidationStatusType 
} from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export interface RegexInputIncrementalProps
  extends React.ComponentProps<"input"> {
  regex: RegExp;
  onValidation?: (status: ValidationStatusType) => void;
}

export function RegexInputIncremental({
  regex,
  value,
  onChange,
  onValidation,
  defaultValue,
  ...props
}: RegexInputIncrementalProps) {
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
    onValidation,
    defaultValue: defaultValue as string | undefined,
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
