import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerState } from "@/lib/subscription";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = data.user.id;
    const userEmail = data.user.email;

    // Try to get customer state
    const customerState = await getCustomerState(userId);

    // Also try direct API call for debugging
    const apiUrl = env.POLAR_IS_SANDBOX
      ? "https://sandbox-api.polar.sh"
      : "https://api.polar.sh";

    const directResponse = await fetch(
      `${apiUrl}/v1/customers/external/${userId}/state`,
      {
        headers: {
          Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
        },
      }
    );

    return NextResponse.json({
      user: {
        id: userId,
        email: userEmail,
      },
      environment: {
        isSandbox: env.POLAR_IS_SANDBOX,
        apiUrl,
        productId: env.POLAR_PRODUCT_ID,
      },
      customerState,
      directApiCall: {
        status: directResponse.status,
        statusText: directResponse.statusText,
        response: directResponse.ok
          ? await directResponse.json()
          : await directResponse.text(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
