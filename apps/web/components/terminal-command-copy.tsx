"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { cn } from "@workspace/shadverse/lib/utils";
// import Logo from "@/components/logos"
import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/shadverse/components/card";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/shadverse/components/alert";

// shadcn logo
function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      role="img"
      aria-label="Terminal logo"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}

interface TerminalCommandCopyProps {
  logo?: React.ReactNode;
  className?: string;
  command?: string;
  token?: string;
}

export function TerminalCommandCopy({
  logo = (
    <Logo className="h-8 w-8 rounded opacity-80 transition group-hover:opacity-100" />
  ),
  className,
  token,
}: TerminalCommandCopyProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState<null | "success" | "error">(
    null
  );

  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return") || "/";

  const command = `pnpm dlx shadcn add "${`${window.location.origin + returnPath}?token=${token}`}"`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setIsCopied(true);
      setShowAlert("success");
      setTimeout(() => {
        setIsCopied(false);
        setShowAlert(null);
      }, 1500);
    } catch {
      setShowAlert("error");
      setTimeout(() => setShowAlert(null), 1500);
    }
  }

  return (
    <div
      className={cn("flex min-h-[40vh] items-center justify-center", className)}
    >
      <Card className="w-full rounded-2xl border-none bg-background/90 shadow-xl backdrop-blur dark:bg-background/80">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          {logo && (
            <span className="mb-2 rounded-full bg-primary/10 p-3 shadow">
              {logo}
            </span>
          )}
          <CardTitle className="text-center font-semibold text-xl tracking-tight">
            Install with your access token
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-sm">
            Copy and run this command in your terminal to install your private
            component. This access token is expirable.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-border bg-muted px-3 py-2 font-mono">
            <span className="flex-1 select-all break-all text-xs md:text-sm">
              {command}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="ml-2 text-muted-foreground hover:text-primary"
              onClick={handleCopy}
              aria-label="Copy command"
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          {showAlert === "success" && (
            <Alert className="mt-4">
              <AlertTitle>Command copied to clipboard!</AlertTitle>
            </Alert>
          )}
          {showAlert === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Failed to copy command</AlertTitle>
              <AlertDescription>Please try again.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TerminalCommandCopy;
