"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@workspace/shadverse/components/button";
import { Badge } from "@workspace/shadverse/components/badge";

interface CliCommandsProps {
  name: string;
  type: "free" | "pro";
}

export default function CliCommands({ name, type }: CliCommandsProps) {
  const [copied, setCopied] = useState(false);

  // For now, we'll show a placeholder command
  // This would be replaced with actual CLI commands for domain-ui
  const command =
    type === "pro"
      ? `npx domain-ui@latest add --pro ${name}`
      : `npx domain-ui@latest add ${name}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard is not available
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-lg tracking-tight">CLI Installation</p>
        <Badge
          variant={type === "pro" ? "default" : "secondary"}
          className="text-xs"
        >
          {type}
        </Badge>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3 font-mono text-sm">
          <code className="text-foreground">{command}</code>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <CopyIcon className="h-3 w-3" />
            )}
          </Button>
        </div>

        {type === "pro" && (
          <p className="mt-2 text-muted-foreground text-xs">
            Pro components require a license. Visit our pricing page to learn
            more.
          </p>
        )}
      </div>
    </div>
  );
}
