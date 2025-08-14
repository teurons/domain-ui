"use client";

import { IndianPassport } from "../components/domain-ui/indian-passport";

export function IndianPassportDemo() {
  return (
    <IndianPassport
      placeholder="Enter passport number (e.g., A1234567)"
      onChange={(e) => console.log("Passport:", e.target.value)}
    />
  );
}