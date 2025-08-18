"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  CodeBlock as BaseCodeBlock,
  Pre,
  type CodeBlockProps as BaseCodeBlockProps,
} from "fumadocs-ui/components/codeblock";
import { highlight } from "fumadocs-core/highlight";
import { transformerMetaHighlight } from "@shikijs/transformers";
import { getBaseUrl } from "../lib/get-base-url";
import type { RegistryItem } from "shadcn/registry";

interface RegistryAllFilesProps {
  name: string;
  type: "free" | "pro";
  wrapper?: BaseCodeBlockProps;
}

// interface RegistryFile {
//   path: string;
//   content: string;
//   type: string;
// }

// interface RegistryItem {
//   name: string;
//   type: string;
//   files: RegistryFile[];
// }

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
    default:
      return extension || "text";
  }
}

async function fetchRegistryItem(url: string): Promise<RegistryItem> {
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registry item: ${response.status} ${response.statusText}`
    );
  }

  const registryItem: RegistryItem = await response.json();

  if (!registryItem) {
    throw new Error(`Registry item not found at "${url}"`);
  }

  return registryItem;
}

async function highlightCode(
  code: string,
  lang: string,
  wrapper?: BaseCodeBlockProps,
  dataAttributes?: Record<string, string>
): Promise<ReactElement> {
  const rendered = await highlight(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    components: {
      pre: Pre,
    },
    transformers: [transformerMetaHighlight()],
  });

  return (
    <BaseCodeBlock {...wrapper} {...dataAttributes}>
      {rendered}
    </BaseCodeBlock>
  );
}

export default function RegistryAllFiles({
  name,
  type,
  wrapper,
}: RegistryAllFilesProps) {
  const [content, setContent] = useState<ReactElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAllFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = getBaseUrl();
        const registryPath = type === "pro" ? "/r-pro" : "/r";
        const url = `${baseUrl}${registryPath}/${name}.json`;

        const registryItem = await fetchRegistryItem(url);

        const renderedFiles = await Promise.all(
          registryItem.files.map(async (file, index) => {
            const lang = getLanguageFromPath(file.path);
            const renderedCode = await highlightCode(
              file.content,
              lang,
              wrapper,
              {
                "data-registry-url": url,
                "data-file": file.path,
                "data-file-type": file.type,
              }
            );

            return (
              <div key={`${file.path}-${index}`} className="space-y-2">
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <h4 className="font-medium font-mono text-sm">{file.path}</h4>
                  <p className="text-muted-foreground text-xs">{file.type}</p>
                </div>
                {renderedCode}
              </div>
            );
          })
        );

        if (isMounted) {
          setContent(renderedFiles);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAllFiles();

    return () => {
      isMounted = false;
    };
  }, [name, type, wrapper]);

  if (isLoading) {
    return (
      <BaseCodeBlock {...wrapper}>
        <Pre>Loading registry files...</Pre>
      </BaseCodeBlock>
    );
  }

  if (error) {
    return (
      <BaseCodeBlock {...wrapper}>
        <Pre>Error loading registry: {error}</Pre>
      </BaseCodeBlock>
    );
  }

  return <div className="space-y-6">{content}</div>;
}
