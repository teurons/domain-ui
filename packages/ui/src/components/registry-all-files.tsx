"use client";

import { getBaseUrl } from "../lib/get-base-url";
import { ShadcnRegistryItemCodeBlock } from "@workspace/domain-ui-registry/components/domain-ui/shadcn-registry-item-code-block";

interface RegistryAllFilesProps {
  name: string;
  type: "free" | "pro";
}

/**
 * Builds the registry URL for a given component
 * @param name - The component name
 * @param type - Whether it's a free or pro component
 * @returns The full registry URL
 */
export function getRegistryUrl(
  name: string,
  type: "free" | "pro" = "free"
): string {
  const baseUrl = getBaseUrl();
  const registryPath = type === "pro" ? "/r-pro" : "/r";
  return `${baseUrl}${registryPath}/${name}.json`;
}

export default function RegistryAllFiles({
  name,
  type,
}: RegistryAllFilesProps) {
  const url = getRegistryUrl(name, type);

  return <ShadcnRegistryItemCodeBlock url={url} />;
}
