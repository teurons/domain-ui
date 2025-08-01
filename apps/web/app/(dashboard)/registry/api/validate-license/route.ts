import { NextRequest, NextResponse } from "next/server";
import { validateLicenseKey } from "@/lib/polar/client";
import { generateToken } from "@/lib/shadcn/registry/utils";
import { error as logError } from "@/lib/logger";

interface ValidateLicenseRequest {
  licenseKey: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ValidateLicenseRequest;
    const { licenseKey } = body;

    // Real validation with Polar
    const result = await validateLicenseKey(licenseKey);

    // If there is an error in the Polar client response
    if ("error" in result) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 }
      );
    }

    // Consider valid if status is "granted"
    if (result.status === "granted") {
      const token = await generateToken();
      return NextResponse.json({ valid: true, token });
    }

    return NextResponse.json(
      { valid: false, error: "Invalid license key." },
      { status: 400 }
    );
  } catch (err) {
    logError("License validation API error", err);
    return NextResponse.json(
      { valid: false, error: (err as Error).message || "Malformed request." },
      { status: 400 }
    );
  }
}
