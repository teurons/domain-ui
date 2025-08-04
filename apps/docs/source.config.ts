import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import { defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {
  transformerRemoveNotationEscape,
  transformerNotationFocus,
  transformerMetaHighlight,
} from "@shikijs/transformers";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { z } from "zod";

export const docs = defineDocs({
  dir: "../../packages/content/docs",
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    // providerImportSource: "@/mdx-components",
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
        transformerRemoveNotationEscape(),
        transformerNotationFocus(),
        transformerMetaHighlight(),
      ],
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
