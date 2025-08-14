"use client";

import { UsaPassport } from "../components/domain-ui/usa-passport";

export function UsaPassportDemo() {
  return (
    <UsaPassport
      placeholder="Enter passport number (e.g., 123456789)"
      onChange={(e) => console.log("USA Passport:", e.target.value)}
    />
  );
}