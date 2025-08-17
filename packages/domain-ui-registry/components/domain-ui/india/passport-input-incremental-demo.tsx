"use client";

import { PassportInputIncremental } from "./passport-input-incremental";
import { ValidationDemoWrapperIncremental } from "../validation-demo-wrapper-incremental";

export function PassportInputIncrementalDemo() {
  return (
    <ValidationDemoWrapperIncremental
      validMessage="Valid Indian passport number"
      invalidMessage="Invalid character - passport must be 1 letter followed by 7 digits"
      incompleteMessage="Continue entering passport number (format: A1234567)"
    >
      {({ value, onChange, onValidation, className }) => (
        <PassportInputIncremental
          placeholder="Enter passport number (e.g., A1234567)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
          showLabel={false}
        />
      )}
    </ValidationDemoWrapperIncremental>
  );
}
