"use client";

import { ShadcnRegistryItemCodeBlock } from "@workspace/domain-ui-registry/components/domain-ui/shadcn-registry-item-code-block";

export default function ShadcnRegistryItemCodeBlockDemo() {
  return (
    <div className="w-full">
      <ShadcnRegistryItemCodeBlock url="https://supabase.com/ui/r/password-based-auth-nextjs.json" />
    </div>
  );
}
