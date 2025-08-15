"use client";

import { PassportInput } from "./passport-input";

export function PassportInputDemo() {
  return (
    <PassportInput
      placeholder="Enter passport number (e.g., 123456789)"
      onChange={(e) => console.log("UK Passport:", e.target.value)}
    />
  );
}