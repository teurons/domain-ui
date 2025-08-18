"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Pre } from "fumadocs-ui/components/codeblock";
import { highlight } from "fumadocs-core/highlight";
import { transformerMetaHighlight } from "@shikijs/transformers";
import { Button } from "@workspace/domain-ui-registry/components/ui/button";
import { Copy, Check, FileText } from "lucide-react";
import type { FileNode } from "./registry-file-tree";

function getLanguageFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "css":
      return "css";
    case "md":
      return "markdown";
    case "mdx":
      return "mdx";
    default:
      return extension || "text";
  }
}

function getFileIcon() {
  return <FileText className="h-3 w-3" />;
}

// Simple copy-to-clipboard hook
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return { isCopied, copyToClipboard };
}

interface RegistryCodeDisplayProps {
  file: FileNode | null;
  url: string;
}

export function RegistryCodeDisplay({ file, url }: RegistryCodeDisplayProps) {
  const [highlightedCode, setHighlightedCode] = useState<ReactElement | null>(
    null
  );
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (!file?.content) {
      setHighlightedCode(null);
      return;
    }

    const highlightCode = async () => {
      const lang = getLanguageFromPath(file.path);
      const content = file.content || "";

      // Remove custom wrapper as it's not being used

      const rendered = await highlight(content, {
        lang,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        components: {
          pre: (props) => (
            <Pre
              {...props}
              className="!bg-transparent !p-0 !m-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent overflow-x-auto"
            />
          ),
        },
        transformers: [transformerMetaHighlight()],
      });

      const codeBlock = (
        <div className="relative overflow-hidden rounded-lg border bg-card">
          <div
            data-registry-url={url}
            data-file={file.path}
            data-file-type={file.registryType}
            className="overflow-x-auto"
          >
            {rendered}
          </div>
        </div>
      );

      setHighlightedCode(codeBlock);
    };

    highlightCode();
  }, [file, url]);

  if (!file) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/20 text-muted-foreground/60">
        <div className="flex flex-col items-center gap-2 text-center">
          <FileText className="h-8 w-8 opacity-50" />
          <p className="text-sm">Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Compact file header */}
      <div className="flex items-center justify-between border-b bg-muted/10 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          {getFileIcon()}
          <p className="truncate text-muted-foreground text-sm">{file.path}</p>
        </div>

        <div className="ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(file.content || "")}
            className="h-7 gap-1.5 px-2 text-xs hover:bg-muted"
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code content with proper overflow handling */}
      <div className="flex-1 overflow-auto bg-card">
        {highlightedCode || (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
