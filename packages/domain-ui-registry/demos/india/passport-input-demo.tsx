"use client";

import { PassportInput } from "@workspace/domain-ui-registry/components/domain-ui/india/passport-input";
import { ValidationDemoWrapper } from "@workspace/domain-ui-registry/demos/validation-demo-wrapper";

export function PassportInputDemo() {
  return (
    <ValidationDemoWrapper
      validMessage="Valid Indian passport number"
      invalidMessage="Invalid passport format. Expected format: A1234567 (1 letter + 7 digits)"
      incompleteMessage="Enter complete passport number"
      expectedLength={8}
    >
      {({ value, onChange, onValidation, className }) => (
        <PassportInput
          placeholder="Enter passport number (e.g., A1234567)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
          showLabel={false}
        />
      )}
    </ValidationDemoWrapper>
  );
}
