"use client";

import { useEffect, useState } from "react";
import type { RegistryItem } from "shadcn/registry";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Button } from "@workspace/domain-ui-registry/components/ui/button";
import { PanelLeftClose, PanelLeft, FileText } from "lucide-react";
import { transformRegistryFilesToTree } from "../lib/registry-utils";
import { RegistryFileTree, type FileNode } from "./registry-file-tree";

function getLanguageFromPath(path: string): string {
  return path.split(".").pop()?.toLowerCase() || "text";
}

// Get all files from tree (flattened)
function getAllFilesFromTree(nodes: FileNode[]): FileNode[] {
  const files: FileNode[] = [];

  function traverse(nodeList: FileNode[]) {
    for (const node of nodeList) {
      if (node.type === "file") {
        files.push(node);
      } else if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return files;
}

// Find file in tree by path
function findFileInTree(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      const found = findFileInTree(node.children, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
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

interface RegistryItemDisplayProps {
  url: string;
}

export function RegistryItemDisplay({ url }: RegistryItemDisplayProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchRegistryItem(url)
      .then((registryItem) => {
        if (!registryItem.files || registryItem.files.length === 0) {
          throw new Error("No files found in registry item");
        }

        const treeFiles = transformRegistryFilesToTree(registryItem.files);

        if (isMounted) {
          setFiles(treeFiles);
          // Set initial selected file
          const firstFile = getAllFilesFromTree(treeFiles)[0];
          if (firstFile) {
            setSelectedFile(firstFile.path);
          }
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
  }, [url]);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground text-sm">
          Loading registry files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-red-500 text-sm">Error loading registry: {error}</p>
      </div>
    );
  }

  // Dynamic UI based on file count
  const allFiles = getAllFilesFromTree(files);

  // Single file: use simple approach
  if (allFiles.length === 1) {
    const singleFile = allFiles[0];
    if (!singleFile) {
      return (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">No files found</p>
        </div>
      );
    }

    const language = getLanguageFromPath(singleFile.path);
    const code = singleFile.content || "";

    return (
      <div className="space-y-2">
        <div className="rounded-md bg-muted/50 px-3 py-2">
          <h4 className="font-medium font-mono text-sm">{singleFile.path}</h4>
          <p className="text-muted-foreground text-xs">
            {singleFile.registryType}
          </p>
        </div>
        <DynamicCodeBlock lang={language} code={code} />
      </div>
    );
  }

  // Multiple files: use split-pane interface
  const selectedFileNode = selectedFile
    ? findFileInTree(files, selectedFile)
    : null;

  return (
    <div className="my-4 flex h-[600px] overflow-hidden rounded-lg border bg-background shadow-sm">
      {/* File tree toggle button - only show when collapsed */}
      {isFileTreeCollapsed && (
        <div className="flex flex-col border-r bg-muted/20">
          <div className="border-b p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFileTreeCollapsed(false)}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Show file tree"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* File tree */}
      {!isFileTreeCollapsed && (
        <div className="flex w-[280px] flex-col">
          <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              Files
            </h4>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/60 text-xs">
                {getAllFilesFromTree(files).length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFileTreeCollapsed(true)}
                className="h-6 w-6 p-0 hover:bg-muted/60"
                title="Hide file tree"
              >
                <PanelLeftClose className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <RegistryFileTree
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
      )}

      {/* Code display */}
      {selectedFileNode ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Compact file header */}
          <div className="flex items-center justify-between border-b bg-muted/10 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-3 w-3" />
              <p className="truncate text-muted-foreground text-sm">
                {selectedFileNode.path}
              </p>
            </div>
          </div>
          {/* Code content with DynamicCodeBlock */}
          <div className="flex-1 overflow-auto bg-card p-4">
            <DynamicCodeBlock
              lang={getLanguageFromPath(selectedFileNode.path)}
              code={selectedFileNode.content || ""}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-muted/20 text-muted-foreground/60">
          <div className="flex flex-col items-center gap-2 text-center">
            <FileText className="h-8 w-8 opacity-50" />
            <p className="text-sm">Select a file to view its contents</p>
          </div>
        </div>
      )}
    </div>
  );
}
