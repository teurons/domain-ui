"use client";

import RegistryCodeBlock from "./registry-code-block";
import type { CodeBlockProps as BaseCodeBlockProps } from "fumadocs-ui/components/codeblock";

interface DynamicRegistryCodeBlockProps {
  name: string;
  baseUrl: string;
  registry?: "free" | "pro";
  filePath?: string;
  fileType?: string;
  wrapper?: BaseCodeBlockProps;
}

export default function DynamicRegistryCodeBlock({
  name,
  baseUrl,
  registry = "free",
  filePath,
  fileType,
  wrapper,
}: DynamicRegistryCodeBlockProps) {
  const registryPath = registry === "pro" ? "/r-pro" : "/r";
  const url = `${baseUrl}${registryPath}/${name}.json`;

  return (
    <RegistryCodeBlock
      url={url}
      filePath={filePath}
      fileType={fileType}
      wrapper={wrapper}
    />
  );
}
