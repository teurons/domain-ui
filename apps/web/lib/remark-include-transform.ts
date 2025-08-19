import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Code } from "mdast";

const convertWorkspacePathsToUserPaths = (content: string): string => {
  return content
    .replace(/@workspace\/domain-ui-registry\/components/g, "@/components")
    .replace(/@workspace\/domain-ui-registry\/hooks/g, "@/hooks")
    .replace(/@workspace\/domain-ui-registry\/lib/g, "@/lib")
    .replace(/@workspace\/domain-ui-pro-registry\/components/g, "@/components")
    .replace(/@workspace\/domain-ui-pro-registry\/hooks/g, "@/hooks")
    .replace(/@workspace\/domain-ui-pro-registry\/lib/g, "@/lib");
};

/**
 * Remark plugin to transform import paths in code blocks from include directives
 */
export const remarkIncludeTransform: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "code", (node: Code) => {
      if (
        node.value &&
        typeof node.value === "string" &&
        node.value.includes("@workspace/")
      ) {
        node.value = convertWorkspacePathsToUserPaths(node.value);
      }
    });
  };
};