"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  validateIncrementalInput,
  matches,
  canPartiallyMatch,
} from "../lib/incremental-regex";

/**
 * React Hook for Incremental Regex Input Validation
 *
 * Provides configurable real-time regex validation that:
 * - Accepts partial input that could eventually match
 * - Rejects characters that make matching impossible
 * - Works with any JavaScript RegExp, including complex alternation patterns
 * - Supports paste detection and full validation
 * - Provides error states and validation control
 *
 * Uses NFA-based incremental matching for proper regex support.
 */

export const ValidationStatus = {
  Valid: "valid",
  Incomplete: "incomplete",
  Invalid: "invalid",
} as const;

export type ValidationStatusType = typeof ValidationStatus[keyof typeof ValidationStatus];

export interface UseIncrementalRegexProps {
  regex: RegExp;
  value?: string;
  onChange?: (value: string) => void;
  onValidation?: (status: ValidationStatusType) => void;
  defaultValue?: string;
  transformToUppercase?: boolean;
}

export interface UseIncrementalRegexReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: () => void;
  isValid: boolean;
  validationStatus: ValidationStatusType;
}

export const useIncrementalRegex = ({
  regex,
  value: controlledValue,
  onChange,
  onValidation,
  defaultValue,
  transformToUppercase,
}: UseIncrementalRegexProps): UseIncrementalRegexReturn => {
  // Internal configuration - skip validation for defaults
  const skipLiveValidationForDefaults = true;
  // Initialize with processed default value
  const processedDefaultValue = useMemo(() => {
    if (!defaultValue) {
      return "";
    }

    // If skipLiveValidationForDefaults is false, validate the default value
    if (!skipLiveValidationForDefaults) {
      return validateIncrementalInput(defaultValue, regex);
    }

    return defaultValue;
  }, [defaultValue, regex]);

  const [uncontrolledValue, setUncontrolledValue] = useState(
    processedDefaultValue
  );
  const wasDefaultValueSet = useRef(!!defaultValue);

  // Use controlled value if provided, otherwise use internal state
  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // Validation state computation
  const { isValid, validationStatus } = useMemo(() => {
    const isFullMatch = matches(value, regex);
    const canPartialMatch =
      value.length > 0 ? canPartiallyMatch(value, regex) : true;

    let status: ValidationStatusType;
    if (isFullMatch) {
      status = ValidationStatus.Valid;
    } else if (canPartialMatch) {
      status = ValidationStatus.Incomplete;
    } else {
      status = ValidationStatus.Invalid;
    }

    return {
      isValid: isFullMatch,
      validationStatus: status,
    };
  }, [value, regex]);

  // Notify validation changes
  useEffect(() => {
    if (onValidation) {
      onValidation(validationStatus);
    }
  }, [validationStatus, onValidation]);

  // Track if we're in a paste operation
  const isPasteRef = useRef(false);

  // Handle regular input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Transform to uppercase if requested
      if (transformToUppercase) {
        newValue = newValue.toUpperCase();
      }
      
      let processedValue = newValue;

      // If this was triggered by a paste event, accept the full value
      // Otherwise, validate incrementally
      if (isPasteRef.current) {
        // Accept the full pasted value even if invalid
        processedValue = newValue;
        isPasteRef.current = false; // Reset the flag
      } else {
        // For typing, validate incrementally - keep only valid prefix
        processedValue = validateIncrementalInput(newValue, regex);
      }

      // Clear default value flag after first interaction
      if (wasDefaultValueSet.current) {
        wasDefaultValueSet.current = false;
      }

      // Update state if uncontrolled
      if (controlledValue === undefined) {
        setUncontrolledValue(processedValue);
      }

      // Call onChange callback with processed value
      if (onChange) {
        onChange(processedValue);
      }
    },
    [regex, controlledValue, onChange, transformToUppercase]
  );

  // Handle paste events - just set a flag
  const handlePaste = useCallback(() => {
    isPasteRef.current = true;
  }, []);

  return {
    value,
    onChange: handleChange,
    onPaste: handlePaste,
    isValid,
    validationStatus,
  };
};
