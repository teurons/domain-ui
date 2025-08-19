// source.config.ts
import { defineDocs } from "fumadocs-mdx/config";
import { defineConfig } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import { defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {
  transformerRemoveNotationEscape,
  transformerNotationFocus,
  transformerMetaHighlight
} from "@shikijs/transformers";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { z } from "zod";

// lib/remark-include-transform.ts
import { visit } from "unist-util-visit";
var convertWorkspacePathsToUserPaths = (content) => {
  return content.replace(/@workspace\/domain-ui-registry\/components/g, "@/components").replace(/@workspace\/domain-ui-registry\/hooks/g, "@/hooks").replace(/@workspace\/domain-ui-registry\/lib/g, "@/lib").replace(/@workspace\/domain-ui-pro-registry\/components/g, "@/components").replace(/@workspace\/domain-ui-pro-registry\/hooks/g, "@/hooks").replace(/@workspace\/domain-ui-pro-registry\/lib/g, "@/lib");
};
var remarkIncludeTransform = () => {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (node.value && typeof node.value === "string" && node.value.includes("@workspace/")) {
        node.value = convertWorkspacePathsToUserPaths(node.value);
      }
    });
  };
};

// source.config.ts
var docs = defineDocs({
  dir: "../../packages/content/docs"
});
var blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().or(z.date()).transform((value, context) => {
      try {
        return new Date(value);
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date"
        });
        return z.NEVER;
      }
    }),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    series: z.string().optional(),
    seriesPart: z.number().optional()
  })
});
var source_config_default = defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark"
      },
      transformers: [
        ...rehypeCodeDefaultOptions.transformers ?? [],
        transformerTwoslash(),
        transformerRemoveNotationEscape(),
        transformerNotationFocus(),
        transformerMetaHighlight()
      ]
    },
    remarkPlugins: [remarkMath, remarkIncludeTransform],
    rehypePlugins: (v) => [rehypeKatex, ...v]
  }
});
export {
  blog,
  source_config_default as default,
  docs
};
