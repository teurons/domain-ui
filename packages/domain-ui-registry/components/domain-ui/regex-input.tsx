"use client";

import type * as React from "react";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import { useRegexInput } from "@workspace/domain-ui-registry/hooks/use-regex-input";

export interface RegexInputProps extends React.ComponentProps<"input"> {
  regex: RegExp;
}

export function RegexInput({
  regex,
  value,
  onChange,
  ...props
}: RegexInputProps) {
  const { value: displayValue, onChange: handleChange } = useRegexInput({
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
  });

  return <Input {...props} value={displayValue} onChange={handleChange} />;
}
