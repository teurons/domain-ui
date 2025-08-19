"use client";

import { RegistryItemDisplay } from "@workspace/domain-ui-registry/components/domain-ui/registry-item-display";

export default function RegistryItemDisplayDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Registry Item Display</h3>
        <p className="text-muted-foreground mb-4">
          Display registry components with file tree navigation and syntax highlighting.
        </p>
      </div>
      
      <RegistryItemDisplay url="https://www.kibo-ui.com/registry/tree.json" />
    </div>
  );
}