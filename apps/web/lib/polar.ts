import { Polar } from "@polar-sh/sdk";

export const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: process.env.POLAR_IS_SANDBOX === "true" ? "sandbox" : "production",
});
