"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

/**
 * Simple Regex Validation Hook
 *
 * Provides basic regex validation without incremental matching.
 * Just validates if the full input matches the pattern.
 *
 * No NFA dependencies - uses native RegExp.test() only.
 */

export const ValidationStatus = {
  Valid: "valid",
  Invalid: "invalid",
} as const;

export type ValidationStatusType =
  (typeof ValidationStatus)[keyof typeof ValidationStatus];

export interface UseSimpleRegexProps {
  regex: RegExp;
  value?: string;
  onChange?: (value: string) => void;
  onValidation?: (status: ValidationStatusType) => void;
  defaultValue?: string;
}

export interface UseSimpleRegexReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
  validationStatus: ValidationStatusType;
}

export const useSimpleRegex = ({
  regex,
  value: controlledValue,
  onChange,
  onValidation,
  defaultValue,
}: UseSimpleRegexProps): UseSimpleRegexReturn => {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue || ""
  );

  // Use controlled value if provided, otherwise use internal state
  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // Simple validation - just test if it matches
  const { isValid, validationStatus } = useMemo(() => {
    const matches = regex.test(value);
    const status: ValidationStatusType = matches
      ? ValidationStatus.Valid
      : ValidationStatus.Invalid;

    return {
      isValid: matches,
      validationStatus: status,
    };
  }, [value, regex]);

  // Notify validation changes
  useEffect(() => {
    if (onValidation) {
      onValidation(validationStatus);
    }
  }, [validationStatus, onValidation]);

  // Handle input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Update state if uncontrolled
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue);
      }

      // Call onChange callback
      if (onChange) {
        onChange(newValue);
      }
    },
    [controlledValue, onChange]
  );

  return {
    value,
    onChange: handleChange,
    isValid,
    validationStatus,
  };
};
