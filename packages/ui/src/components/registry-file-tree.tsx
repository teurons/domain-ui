"use client";

import type { ReactElement } from "react";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@workspace/shadverse/components/ui/kibo-ui/tree";
import {
  FileCode,
  FileJson,
  FileText,
  FileType,
  File as FileIcon,
} from "lucide-react";

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  content?: string;
  registryType?: string;
}

// Get appropriate icon for file type
function getFileIcon(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "tsx":
    case "ts":
    case "js":
    case "jsx":
      return <FileCode className="h-4 w-4" />;
    case "json":
      return <FileJson className="h-4 w-4" />;
    case "md":
    case "mdx":
    case "txt":
      return <FileText className="h-4 w-4" />;
    case "css":
    case "scss":
    case "sass":
      return <FileType className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
}

// Recursively render tree nodes
function renderTreeNodes(
  nodes: FileNode[],
  onFileSelect: (path: string) => void,
  level = 0
): ReactElement[] {
  return nodes.map((node, index) => {
    const isLast = index === nodes.length - 1;
    const nodeKey = node.path;

    if (node.type === "file") {
      return (
        <TreeNode key={nodeKey} nodeId={nodeKey} level={level} isLast={isLast}>
          <TreeNodeTrigger onClick={() => onFileSelect(node.path)}>
            <TreeExpander />
            <TreeIcon icon={getFileIcon(node.name)} />
            <TreeLabel>{node.name}</TreeLabel>
          </TreeNodeTrigger>
        </TreeNode>
      );
    }

    // Directory node
    return (
      <TreeNode key={nodeKey} nodeId={nodeKey} level={level} isLast={isLast}>
        <TreeNodeTrigger>
          <TreeExpander hasChildren />
          <TreeIcon hasChildren />
          <TreeLabel>{node.name}</TreeLabel>
        </TreeNodeTrigger>
        <TreeNodeContent hasChildren>
          {node.children &&
            renderTreeNodes(node.children, onFileSelect, level + 1)}
        </TreeNodeContent>
      </TreeNode>
    );
  });
}

// Get all file paths for default expanded state
function getAllDirectoryIds(nodes: FileNode[]): string[] {
  const ids: string[] = [];

  function traverse(nodeList: FileNode[]) {
    for (const node of nodeList) {
      if (node.type === "directory" && node.children) {
        ids.push(node.path);
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return ids;
}

interface RegistryFileTreeProps {
  files: FileNode[];
  selectedFile?: string;
  onFileSelect: (path: string) => void;
}

export function RegistryFileTree({
  files,
  selectedFile,
  onFileSelect,
}: RegistryFileTreeProps) {
  // Get all directory IDs for default expansion
  const defaultExpandedIds = getAllDirectoryIds(files);

  return (
    <div className="flex-1 overflow-auto border-r bg-muted/20 py-1">
      <TreeProvider
        defaultExpandedIds={defaultExpandedIds}
        selectable
        selectedIds={selectedFile ? [selectedFile] : []}
        onSelectionChange={(ids: string[]) => {
          const selectedId = Array.isArray(ids) ? ids[0] : ids;
          if (selectedId) {
            onFileSelect(selectedId);
          }
        }}
        showLines
        showIcons
        animateExpand
      >
        <TreeView className="px-2">
          {renderTreeNodes(files, onFileSelect)}
        </TreeView>
      </TreeProvider>
    </div>
  );
}
