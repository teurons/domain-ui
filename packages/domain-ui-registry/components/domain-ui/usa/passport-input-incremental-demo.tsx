"use client";

import { PassportInputIncremental } from "./passport-input-incremental";
import { ValidationDemoWrapperIncremental } from "../validation-demo-wrapper-incremental";

export function PassportInputIncrementalDemo() {
  return (
    <ValidationDemoWrapperIncremental
      validMessage="Valid USA passport number"
      invalidMessage="Invalid character - USA passport formats: A12345678, 123456789, or A1234567"
      incompleteMessage="Continue entering passport number (7-9 characters)"
    >
      {({ value, onChange, onValidation, className }) => (
        <PassportInputIncremental
          placeholder="Enter USA passport (e.g., A12345678 or 123456789)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
        />
      )}
    </ValidationDemoWrapperIncremental>
  );
}
