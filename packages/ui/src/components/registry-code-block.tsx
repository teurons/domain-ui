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

interface RegistryCodeBlockProps {
  url: string;
  filePath?: string;
  fileType?: string;
  wrapper?: BaseCodeBlockProps;
}

interface RegistryFile {
  path: string;
  content: string;
  type: string;
}

interface RegistryItem {
  name: string;
  type: string;
  files: RegistryFile[];
}

function findFile(
  files: RegistryFile[],
  filePath?: string,
  fileType?: string
): RegistryFile | undefined {
  if (filePath) {
    return files.find((file) => file.path === filePath);
  }

  if (fileType) {
    return files.find((file) => file.type === fileType);
  }

  return files[0];
}

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

function validateProps(filePath?: string, fileType?: string): void {
  if (!(filePath || fileType)) {
    throw new Error(
      "Either filePath or fileType must be specified for RegistryCodeBlock"
    );
  }
}

function createFileNotFoundError(
  filePath?: string,
  fileType?: string,
  url?: string
): Error {
  const criteria = filePath ? `path "${filePath}"` : `type "${fileType}"`;
  return new Error(
    `No file found with ${criteria} in registry item from "${url}"`
  );
}

async function processRegistryFile(
  url: string,
  filePath?: string,
  fileType?: string,
  wrapper?: BaseCodeBlockProps
): Promise<ReactElement> {
  validateProps(filePath, fileType);

  const registryItem = await fetchRegistryItem(url);
  const file = findFile(registryItem.files, filePath, fileType);

  if (!file) {
    throw createFileNotFoundError(filePath, fileType, url);
  }

  const lang = getLanguageFromPath(file.path);
  return highlightCode(file.content, lang, wrapper, {
    "data-registry-url": url,
    "data-file": file.path,
  });
}

async function createErrorContent(
  error: unknown,
  wrapper?: BaseCodeBlockProps
): Promise<ReactElement> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return highlightCode(`// Error: ${errorMessage}`, "text", wrapper);
}

export default function RegistryCodeBlock({
  url,
  filePath,
  fileType,
  wrapper,
}: RegistryCodeBlockProps) {
  const [content, setContent] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCode = async () => {
      try {
        setIsLoading(true);
        const result = await processRegistryFile(
          url,
          filePath,
          fileType,
          wrapper
        );
        if (isMounted) {
          setContent(result);
        }
      } catch (err) {
        if (isMounted) {
          const errorContent = await createErrorContent(err, wrapper);
          setContent(errorContent);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCode();

    return () => {
      isMounted = false;
    };
  }, [url, filePath, fileType, wrapper]);

  if (isLoading) {
    return (
      <BaseCodeBlock {...wrapper}>
        <Pre>Loading...</Pre>
      </BaseCodeBlock>
    );
  }

  return content;
}
