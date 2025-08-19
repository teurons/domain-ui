"use client";

import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";

const PAN_REGEX = /^[A-Z]{3}[PCFTABGHLJE]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

export interface PanInputProps extends Omit<RegexInputProps, "regex"> {}

export function PanInput({ onChange, ...props }: PanInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase
    const uppercaseValue = e.target.value.toUpperCase();
    
    // Create new event with uppercase value
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: uppercaseValue },
      currentTarget: { ...e.currentTarget, value: uppercaseValue },
    };
    
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  return <RegexInput regex={PAN_REGEX} onChange={handleChange} {...props} />;
}
