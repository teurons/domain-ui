"use client";

import { PanInput } from "./pan-input";
import { ValidationDemoWrapper } from "../validation-demo-wrapper";

export function PanInputDemo() {
  return (
    <ValidationDemoWrapper
      validMessage="Valid PAN number"
      invalidMessage="Invalid PAN format. Expected format: ABCDE1234F"
      incompleteMessage="Enter complete PAN number"
      expectedLength={10}
    >
      {({ value, onChange, onValidation, className }) => (
        <PanInput
          placeholder="Enter PAN number (e.g., ABCDE1234F)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
        />
      )}
    </ValidationDemoWrapper>
  );
}
