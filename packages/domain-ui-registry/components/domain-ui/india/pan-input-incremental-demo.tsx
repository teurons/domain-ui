"use client";

import { PanInputIncremental } from "./pan-input-incremental";
import { ValidationDemoWrapperIncremental } from "../validation-demo-wrapper-incremental";

export function PanInputIncrementalDemo() {
  return (
    <ValidationDemoWrapperIncremental
      validMessage="Valid PAN number"
      invalidMessage="Invalid character - PAN format: ABCDE1234F"
      incompleteMessage="Continue entering PAN number (10 characters total)"
    >
      {({ value, onChange, onValidation, className }) => (
        <PanInputIncremental
          placeholder="Enter PAN number (e.g., ABCDE1234F)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
        />
      )}
    </ValidationDemoWrapperIncremental>
  );
}
