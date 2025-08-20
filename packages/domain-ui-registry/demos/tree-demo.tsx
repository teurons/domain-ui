"use client";

import { File } from "lucide-react";
import { useState } from "react";
import {
  TreeProvider,
  TreeView,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
} from "@workspace/domain-ui-registry/components/domain-ui/tree";

interface TreeNodeData {
  name: string;
  children: TreeNodeData[];
  metadata: { path: string };
}

// Sample file structure
const sampleFiles = [
  {
    name: "src",
    path: "/src",
    type: "directory" as const,
    children: [
      {
        name: "components",
        path: "/src/components",
        type: "directory" as const,
        children: [
          {
            name: "button.tsx",
            path: "/src/components/button.tsx",
            type: "file" as const,
          },
          {
            name: "card.tsx",
            path: "/src/components/card.tsx",
            type: "file" as const,
          },
          {
            name: "dialog.tsx",
            path: "/src/components/dialog.tsx",
            type: "file" as const,
          },
        ],
      },
      {
        name: "lib",
        path: "/src/lib",
        type: "directory" as const,
        children: [
          {
            name: "utils.ts",
            path: "/src/lib/utils.ts",
            type: "file" as const,
          },
          {
            name: "cn.ts",
            path: "/src/lib/cn.ts",
            type: "file" as const,
          },
        ],
      },
      {
        name: "app.tsx",
        path: "/src/app.tsx",
        type: "file" as const,
      },
    ],
  },
  {
    name: "public",
    path: "/public",
    type: "directory" as const,
    children: [
      {
        name: "favicon.ico",
        path: "/public/favicon.ico",
        type: "file" as const,
      },
      {
        name: "robots.txt",
        path: "/public/robots.txt",
        type: "file" as const,
      },
    ],
  },
  {
    name: "package.json",
    path: "/package.json",
    type: "file" as const,
  },
  {
    name: "README.md",
    path: "/README.md",
    type: "file" as const,
  },
];

const findFirstFile = (
  nodes: typeof sampleFiles
): (typeof sampleFiles)[0] | null => {
  for (const node of nodes) {
    if (node.type === "file") {
      return node;
    }
    if (node.children) {
      const foundFile = findFirstFile(node.children);
      if (foundFile) {
        return foundFile;
      }
    }
  }
  return null;
};

export default function TreeDemo() {
  const [selectedFile, setSelectedFile] = useState<
    (typeof sampleFiles)[0] | null
  >(findFirstFile(sampleFiles));
  // Initialize with the first file's name
  const firstFile = findFirstFile(sampleFiles);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    firstFile ? [firstFile.name] : []
  );

  // Convert sampleFiles to tree format
  const convertToTreeFormat = (nodes: typeof sampleFiles): any => {
    return {
      name: "",
      children: nodes.map((node) => ({
        name: node.name,
        children: node.children
          ? convertToTreeFormat(node.children).children
          : [],
      })),
    };
  };

  const treeData = convertToTreeFormat(sampleFiles);

  // Handle selection change for tree
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedIds(selectedIds);

    if (selectedIds.length > 0) {
      const selectedName = selectedIds[0];

      // Find the selected file in sampleFiles
      const findFileByName = (
        nodes: typeof sampleFiles,
        name: string
      ): (typeof sampleFiles)[0] | null => {
        for (const node of nodes) {
          if (node.name === name) {
            return node;
          }
          if (node.children) {
            const found = findFileByName(node.children, name);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const foundFile = findFileByName(sampleFiles, selectedName);
      if (foundFile && foundFile.type === "file") {
        setSelectedFile(foundFile);
      }
    }
  };

  const renderTreeNode = (
    item: any,
    level = 1,
    isLast = false
  ): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const nodeId = item.name || "root";

    if (!item.name) {
      return item.children?.map((child: any, index: number) =>
        renderTreeNode(child, level, index === item.children.length - 1)
      );
    }

    return (
      <TreeNode key={nodeId} nodeId={nodeId} level={level} isLast={isLast}>
        <TreeNodeTrigger>
          <TreeExpander hasChildren={hasChildren} />
          <TreeIcon
            hasChildren={hasChildren}
            icon={
              hasChildren ? undefined : (
                <File strokeWidth={1.5} size={16} className="shrink-0" />
              )
            }
          />
          <TreeLabel>{item.name}</TreeLabel>
        </TreeNodeTrigger>
        {hasChildren && (
          <TreeNodeContent hasChildren={hasChildren}>
            {item.children?.map((child: any, index: number) => {
              // All children should be at the next level
              return renderTreeNode(
                child,
                level + 1,
                index === item.children.length - 1
              );
            })}
          </TreeNodeContent>
        )}
      </TreeNode>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">File Tree</h3>

      <div className="w-64 h-[400px] py-2 border rounded-lg bg-muted/30 overflow-y-auto">
        <TreeProvider
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          defaultExpandedIds={["src", "components", "lib", "public"]}
          indent={38}
        >
          <TreeView>{renderTreeNode(treeData)}</TreeView>
        </TreeProvider>
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">
          Selected: {selectedFile?.name || "None"}
        </p>
      </div>
    </div>
  );
}
