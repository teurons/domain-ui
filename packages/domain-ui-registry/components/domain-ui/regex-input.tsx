"use client";

import type * as React from "react";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import {
  useSimpleRegex,
  type ValidationStatusType,
} from "@workspace/domain-ui-registry/hooks/use-simple-regex";

export interface RegexInputProps extends React.ComponentProps<"input"> {
  regex: RegExp;
  onValidation?: (status: ValidationStatusType) => void;
  transformToUppercase?: boolean;
}

export function RegexInput({
  regex,
  value,
  onChange,
  onValidation,
  defaultValue,
  transformToUppercase,
  ...props
}: RegexInputProps) {
  const { value: displayValue, onChange: handleChange } = useSimpleRegex({
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
    transformToUppercase,
  });

  return <Input {...props} value={displayValue} onChange={handleChange} />;
}
