"use client";

import { UkPassport } from "../components/domain-ui/uk-passport";

export function UkPassportDemo() {
  return (
    <UkPassport
      placeholder="Enter passport number (e.g., 123456789)"
      onChange={(e) => console.log("UK Passport:", e.target.value)}
    />
  );
}