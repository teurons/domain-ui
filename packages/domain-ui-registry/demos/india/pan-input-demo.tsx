"use client";

import { PanInput } from "@workspace/domain-ui-registry/components/domain-ui/india/pan-input";
import { ValidationDemoWrapper } from "@workspace/domain-ui-registry/demos/validation-demo-wrapper";

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
