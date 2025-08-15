"use client";

import { IndianPassportIncremental } from "../components/domain-ui/indian-passport-incremental";

export function IndianPassportDemo() {
  return (
    <IndianPassportIncremental
      placeholder="Enter passport number (e.g., A1234567)"
      onChange={(e) => console.log("Passport:", e.target.value)}
    />
  );
}