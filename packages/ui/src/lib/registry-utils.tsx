import type { FileNode } from "../components/registry-file-tree";

// Transform registry files into tree structure
export function transformRegistryFilesToTree(
  files: { path: string; content?: string; type: string }[]
): FileNode[] {
  const tree: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files by path to ensure proper tree building
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sortedFiles) {
    const pathParts = file.path.split("/");
    let currentPath = "";
    let currentLevel = tree;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLastPart = i === pathParts.length - 1;

      let existingNode = pathMap.get(currentPath);

      if (!existingNode) {
        const newNode: FileNode = {
          name: part,
          path: currentPath,
          type: isLastPart ? "file" : "directory",
          children: isLastPart ? undefined : [],
          content: isLastPart ? (file.content ?? "") : undefined,
          registryType: isLastPart ? file.type : undefined,
        };

        pathMap.set(currentPath, newNode);
        currentLevel.push(newNode);
        existingNode = newNode;
      }

      if (!isLastPart && existingNode.children) {
        currentLevel = existingNode.children;
      }
    }
  }

  return tree;
}
