"use client";

import { useState } from "react";
import { RegistryFileTree, type FileNode } from "./registry-file-tree";
import { RegistryCodeDisplay } from "./registry-code-display";
import { Button } from "@workspace/domain-ui-registry/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

// Get all files from tree (flattened)
export function getAllFilesFromTree(nodes: FileNode[]): FileNode[] {
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
export function findFileInTree(
  nodes: FileNode[],
  path: string
): FileNode | null {
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

interface RegistryCodeViewerProps {
  files: FileNode[];
  url: string;
  className?: string;
}

export function RegistryCodeViewer({
  files,
  url,
  className = "",
}: RegistryCodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string>(() => {
    // Find first file as initial selection
    const firstFile = getAllFilesFromTree(files)[0];
    return firstFile?.path || "";
  });
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false);

  const selectedFileNode = selectedFile
    ? findFileInTree(files, selectedFile)
    : null;

  return (
    <div
      className={`flex h-[600px] overflow-hidden rounded-lg border bg-background shadow-sm ${className}`}
    >
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
      <RegistryCodeDisplay file={selectedFileNode} url={url} />
    </div>
  );
}
