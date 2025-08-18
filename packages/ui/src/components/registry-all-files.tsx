"use client";

import { useEffect, useState } from "react";
import {
  CodeBlock as BaseCodeBlock,
  Pre,
  type CodeBlockProps as BaseCodeBlockProps,
} from "fumadocs-ui/components/codeblock";
import { getBaseUrl } from "../lib/get-base-url";
import type { RegistryItem } from "shadcn/registry";
import { transformRegistryFilesToTree } from "../lib/registry-utils";
import {
  RegistryCodeViewer,
  getAllFilesFromTree,
} from "./registry-code-viewer";
import { RegistrySingleFile } from "./registry-single-file";
import type { FileNode } from "./registry-file-tree";

interface RegistryAllFilesProps {
  name: string;
  type: "free" | "pro";
  wrapper?: BaseCodeBlockProps;
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

function buildRegistryUrl(
  baseUrl: string,
  type: "free" | "pro",
  name: string
): string {
  const registryPath = type === "pro" ? "/r-pro" : "/r";
  return `${baseUrl}${registryPath}/${name}.json`;
}

// Load registry data and return tree structure
async function loadRegistryData(
  name: string,
  type: "free" | "pro"
): Promise<{ files: FileNode[]; url: string }> {
  const url = buildRegistryUrl(getBaseUrl(), type, name);
  const registryItem = await fetchRegistryItem(url);

  if (!registryItem.files || registryItem.files.length === 0) {
    throw new Error(`No files found in registry item "${name}"`);
  }

  const files = transformRegistryFilesToTree(registryItem.files);

  return { files, url };
}

export default function RegistryAllFiles({
  name,
  type,
  wrapper,
}: RegistryAllFilesProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadRegistryData(name, type)
      .then(({ files: treeFiles, url: registryUrl }) => {
        if (isMounted) {
          setFiles(treeFiles);
          setUrl(registryUrl);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(errorMessage);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [name, type]);

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

  // Dynamic UI based on file count
  const allFiles = getAllFilesFromTree(files);

  // Single file: use simple approach
  if (allFiles.length === 1) {
    const singleFile = allFiles[0];
    if (!singleFile) {
      return (
        <BaseCodeBlock {...wrapper}>
          <Pre>No files found</Pre>
        </BaseCodeBlock>
      );
    }

    return (
      <div className="space-y-2">
        <div className="rounded-md bg-muted/50 px-3 py-2">
          <h4 className="font-medium font-mono text-sm">{singleFile.path}</h4>
          <p className="text-muted-foreground text-xs">
            {singleFile.registryType}
          </p>
        </div>
        <RegistrySingleFile file={singleFile} wrapper={wrapper} url={url} />
      </div>
    );
  }

  // Multiple files: use split-pane interface
  return <RegistryCodeViewer files={files} url={url} className="my-4" />;
}
