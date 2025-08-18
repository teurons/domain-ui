"use client";

import { useEffect, useState, createContext, useContext } from "react";
import type { RegistryItem } from "shadcn/registry";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Button } from "@workspace/domain-ui-registry/components/ui/button";
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
import { PanelLeftClose, PanelLeft, FileText } from "lucide-react";
import { FileCode, FileJson, FileType } from "lucide-react";

interface FileData {
  path: string;
  content?: string;
}

interface FileTreeNode {
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  content?: string;
}

interface FileSelectionContextValue {
  selectedFilePath: string;
  setSelectedFilePath: (path: string) => void;
}

const FileSelectionContext = createContext<FileSelectionContextValue | null>(
  null
);

function useFileSelection() {
  const context = useContext(FileSelectionContext);
  if (!context) {
    throw new Error(
      "useFileSelection must be used within FileSelectionProvider"
    );
  }
  return context;
}

// FilePath component - displays file path
interface FilePathProps {
  filePath?: string;
}

function FilePath({ filePath }: FilePathProps) {
  if (!filePath) {
    return null;
  }

  return (
    <div className="border-b bg-muted/10 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <FileText className="h-3 w-3" />
        <p className="text-muted-foreground text-sm">{filePath}</p>
      </div>
    </div>
  );
}

// FileContent component - displays file content
interface FileContentProps {
  files: FileData[];
}

function FileContent({ files }: FileContentProps) {
  const { selectedFilePath } = useFileSelection();

  const selectedFile = files.find((file) => file.path === selectedFilePath);

  if (!selectedFile) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground/60">
        <p className="text-sm">Select a file to view its contents</p>
      </div>
    );
  }

  const language = selectedFile.path.split(".").pop()?.toLowerCase() || "text";

  return (
    <div className="flex-1 overflow-auto bg-card p-4">
      <DynamicCodeBlock lang={language} code={selectedFile.content || ""} />
    </div>
  );
}

// Create or get existing tree node
function createOrGetTreeNode(
  currentPath: string,
  isLastPart: boolean,
  file: FileData,
  pathMap: Map<string, FileTreeNode>,
  currentLevel: FileTreeNode[]
): FileTreeNode {
  let existingNode = pathMap.get(currentPath);

  if (!existingNode) {
    const newNode: FileTreeNode = {
      path: currentPath,
      type: isLastPart ? "file" : "directory",
      children: isLastPart ? undefined : [],
      content: isLastPart ? (file.content ?? "") : undefined,
    };
    pathMap.set(currentPath, newNode);
    currentLevel.push(newNode);
    existingNode = newNode;
  }

  return existingNode;
}

// Process single file into tree
function processFileIntoTree(
  file: FileData,
  tree: FileTreeNode[],
  pathMap: Map<string, FileTreeNode>
): void {
  const pathParts = file.path.split("/");
  let currentPath = "";
  let currentLevel = tree;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (!part) {
      continue;
    }

    currentPath = currentPath ? `${currentPath}/${part}` : part;
    const isLastPart = i === pathParts.length - 1;

    const existingNode = createOrGetTreeNode(
      currentPath,
      isLastPart,
      file,
      pathMap,
      currentLevel
    );

    if (!isLastPart && existingNode.children) {
      currentLevel = existingNode.children;
    }
  }
}

// Transform files into tree structure
function transformFilesToTree(files: FileData[]): FileTreeNode[] {
  const tree: FileTreeNode[] = [];
  const pathMap = new Map<string, FileTreeNode>();

  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sortedFiles) {
    processFileIntoTree(file, tree, pathMap);
  }

  return tree;
}

// Get all directory paths for default expansion
function getAllDirectoryIds(nodes: FileTreeNode[]): string[] {
  const ids: string[] = [];

  function traverse(nodeList: FileTreeNode[]) {
    for (const node of nodeList) {
      if (node.type === "directory") {
        ids.push(node.path);
        if (node.children) {
          traverse(node.children);
        }
      }
    }
  }

  traverse(nodes);
  return ids;
}

// Tree nodes component
function TreeNodes({
  nodes,
  level = 0,
}: {
  nodes: FileTreeNode[];
  level?: number;
}) {
  const { setSelectedFilePath } = useFileSelection();

  return (
    <>
      {nodes.map((node, index) => {
        const nodeKey = node.path;
        const fileName = node.path.split("/").pop() || "";
        const isLast = index === nodes.length - 1;

        if (node.type === "file") {
          return (
            <TreeNode
              key={nodeKey}
              nodeId={nodeKey}
              level={level}
              isLast={isLast}
            >
              <TreeNodeTrigger onClick={() => setSelectedFilePath(node.path)}>
                <TreeExpander />
                <TreeIcon />
                <TreeLabel>{fileName}</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>
          );
        }

        return (
          <TreeNode
            key={nodeKey}
            nodeId={nodeKey}
            level={level}
            isLast={isLast}
          >
            <TreeNodeTrigger>
              <TreeExpander hasChildren />
              <TreeIcon hasChildren />
              <TreeLabel>{fileName}</TreeLabel>
            </TreeNodeTrigger>
            <TreeNodeContent hasChildren>
              {node.children && (
                <TreeNodes nodes={node.children} level={level + 1} />
              )}
            </TreeNodeContent>
          </TreeNode>
        );
      })}
    </>
  );
}

// FileTree component - displays file tree with toolbar
interface FileTreeProps {
  files: FileData[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function FileTree({ files, collapsed, onToggleCollapse }: FileTreeProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col border-r bg-muted/20">
        <div className="border-b p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const treeNodes = transformFilesToTree(files);
  const defaultExpandedIds = getAllDirectoryIds(treeNodes);

  return (
    <div className="flex w-[280px] flex-col">
      <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
        <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
          Files
        </h4>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground/60 text-xs">
            {files.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted/60"
          >
            <PanelLeftClose className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto border-r bg-muted/20 py-1">
        <TreeProvider defaultExpandedIds={defaultExpandedIds}>
          <TreeView>
            <TreeNodes nodes={treeNodes} />
          </TreeView>
        </TreeProvider>
      </div>
    </div>
  );
}

async function fetchRegistryItem(url: string): Promise<RegistryItem> {
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Failed to fetch registry item: ${response.status}`);
  }

  const registryItem: RegistryItem = await response.json();

  if (!registryItem) {
    throw new Error(`Registry item not found at "${url}"`);
  }

  return registryItem;
}

// Main component
interface RegistryItemDisplayProps {
  url: string;
}

export function RegistryItemDisplay({ url }: RegistryItemDisplayProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchRegistryItem(url)
      .then((registryItem) => {
        if (!registryItem.files || registryItem.files.length === 0) {
          throw new Error("No files found in registry item");
        }

        const fileData: FileData[] = registryItem.files.map((file) => ({
          path: file.path,
          content: file.content,
        }));

        if (isMounted) {
          setFiles(fileData);
          setSelectedFilePath(fileData[0]?.path || "");
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
        <p className="text-destructive text-sm">
          Error loading registry: {error}
        </p>
      </div>
    );
  }

  const fileSelectionValue = {
    selectedFilePath,
    setSelectedFilePath,
  };

  // Single file layout
  if (files.length === 1) {
    return (
      <FileSelectionContext.Provider value={fileSelectionValue}>
        <div className="space-y-2">
          <FilePath filePath={selectedFilePath} />
          <FileContent files={files} />
        </div>
      </FileSelectionContext.Provider>
    );
  }

  // Multiple files layout
  return (
    <FileSelectionContext.Provider value={fileSelectionValue}>
      <div className="my-4 flex h-[600px] overflow-hidden rounded-lg border bg-background shadow-sm">
        {/* <TreeExample /> */}
        <FileTree
          files={files}
          collapsed={isTreeCollapsed}
          onToggleCollapse={() => setIsTreeCollapsed(!isTreeCollapsed)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <FilePath filePath={selectedFilePath} />
          <FileContent files={files} />
        </div>
      </div>
    </FileSelectionContext.Provider>
  );
}
