"use client";

import { UkPassportIncremental } from "../components/domain-ui/uk-passport-incremental";

export function UkPassportDemo() {
  return (
    <UkPassportIncremental
      placeholder="Enter passport number (e.g., 123456789)"
      onChange={(e) => console.log("UK Passport:", e.target.value)}
    />
  );
}