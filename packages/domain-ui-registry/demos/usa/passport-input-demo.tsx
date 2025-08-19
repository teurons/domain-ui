"use client";

import { PassportInput } from "@workspace/domain-ui-registry/components/domain-ui/usa/passport-input";
import { ValidationDemoWrapper } from "@workspace/domain-ui-registry/demos/validation-demo-wrapper";

export function PassportInputDemo() {
  return (
    <ValidationDemoWrapper
      validMessage="Valid USA passport number"
      invalidMessage="Invalid passport format. Expected: A12345678, 123456789, or A1234567"
      incompleteMessage="Enter complete passport number (8-9 characters)"
      expectedLength={8}
    >
      {({ value, onChange, onValidation, className }) => (
        <PassportInput
          placeholder="Enter USA passport number (e.g., A12345678 or 123456789)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
        />
      )}
    </ValidationDemoWrapper>
  );
}
