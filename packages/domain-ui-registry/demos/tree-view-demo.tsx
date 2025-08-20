"use client";

import { File } from "lucide-react";
import { useState } from "react";
import {
  TreeView,
  TreeViewItem,
  flattenTree,
} from "@workspace/domain-ui-registry/components/domain-ui/tree-view";
import {
  TreeProvider,
  TreeView as TreeViewVanilla,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
} from "@workspace/domain-ui-registry/components/domain-ui/tree-vanilla";

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

const flattenChildren = (files: typeof sampleFiles): TreeNodeData[] => {
  return files.map(
    (node): TreeNodeData => ({
      name: node.name,
      children: node.children ? flattenChildren(node.children) : [],
      metadata: { path: node.path },
    })
  );
};

const findFirstFile = (nodes: typeof sampleFiles): typeof sampleFiles[0] | null => {
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

export default function TreeViewDemo() {
  const [selectedFile, setSelectedFile] = useState<typeof sampleFiles[0] | null>(
    findFirstFile(sampleFiles)
  );
  // Initialize with the first file's name for the vanilla tree
  const firstFile = findFirstFile(sampleFiles);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    firstFile ? [firstFile.name] : []
  );
  const flattenedData = flattenTree({ name: "", children: flattenChildren(sampleFiles) });

  // Handle file selection from the TreeView
  const handleNodeSelect = (element: any) => {
    const findFileByPath = (nodes: typeof sampleFiles, path: string): typeof sampleFiles[0] | null => {
      for (const node of nodes) {
        if (node.path === path) {
          return node;
        }
        if (node.children) {
          const found = findFileByPath(node.children, path);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const filePath = element.metadata.path;
    const foundFile = findFileByPath(sampleFiles, filePath);

    if (foundFile?.type === "directory") {
      return;
    }

    setSelectedFile(foundFile || null);
  };

  // Convert sampleFiles to tree-vanilla format
  const convertToVanillaFormat = (nodes: typeof sampleFiles): any => {
    return {
      name: '',
      children: nodes.map((node) => ({
        name: node.name,
        children: node.children ? convertToVanillaFormat(node.children).children : []
      }))
    };
  };

  const vanillaTreeData = convertToVanillaFormat(sampleFiles);

  // Handle selection change for vanilla tree
  const handleVanillaSelectionChange = (selectedIds: string[]) => {
    setSelectedIds(selectedIds);
    
    if (selectedIds.length > 0) {
      const selectedName = selectedIds[0];
      
      // Find the selected file in sampleFiles
      const findFileByName = (nodes: typeof sampleFiles, name: string): typeof sampleFiles[0] | null => {
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

  const renderTreeNode = (item: any, level: number = 1, isLast = false): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const nodeId = item.name || 'root';

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
            icon={!hasChildren ? <File strokeWidth={1.5} size={16} className="shrink-0" /> : undefined}
          />
          <TreeLabel>{item.name}</TreeLabel>
        </TreeNodeTrigger>
        {hasChildren && (
          <TreeNodeContent hasChildren={hasChildren}>
            {item.children?.map((child: any, index: number) => {
              // All children should be at the next level
              return renderTreeNode(child, level + 1, index === item.children.length - 1);
            })}
          </TreeNodeContent>
        )}
      </TreeNode>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Tree View (react-accessible-treeview based) */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tree View (react-accessible-treeview)</h3>
        
        <div className="w-64 h-[400px] py-2 border rounded-lg bg-muted/30 overflow-y-auto">
          <TreeView
            data={flattenedData}
            aria-label="file browser"
            className="w-full"
            defaultExpandedIds={flattenedData.filter((n) => n.children?.length).map((n) => n.id)}
            defaultSelectedIds={flattenedData
              .filter((n) => n.metadata?.path === selectedFile?.path)
              .map((n) => n.id)}
            onNodeSelect={({ element }) => handleNodeSelect(element)}
            nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level, isSelected }) => (
              <TreeViewItem
                {...getNodeProps()}
                isExpanded={isExpanded}
                isBranch={isBranch}
                isSelected={isSelected}
                level={level}
                icon={<File strokeWidth={1.5} size={16} className="shrink-0" />}
                name={element.name}
                className="gap-1.5"
              />
            )}
          />
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            Selected: {selectedFile?.name || "None"}
          </p>
        </div>
      </div>

      {/* Tree Vanilla (Kibo-UI based) */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tree Vanilla (Kibo-UI based)</h3>
        
        <div className="w-64 h-[400px] py-2 border rounded-lg bg-muted/30 overflow-y-auto">
          <TreeProvider
            selectedIds={selectedIds}
            onSelectionChange={handleVanillaSelectionChange}
            defaultExpandedIds={['src', 'components', 'lib', 'public']}
            indent={38}
          >
            <TreeViewVanilla>
              {renderTreeNode(vanillaTreeData)}
            </TreeViewVanilla>
          </TreeProvider>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            Selected: {selectedFile?.name || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}