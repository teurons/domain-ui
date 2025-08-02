import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { transformerTwoslash } from "fumadocs-twoslash";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {
  transformerRemoveNotationEscape,
  transformerRemoveNotationEscape,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerMetaHighlight,
} from "@shikijs/transformers";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { remarkInstall } from "fumadocs-docgen";

export const docs = defineDocs({
  dir: "../../packages/content/docs",
});

export const blog = defineCollections({
  type: "doc",
  dir: "../../packages/content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((value, context) => {
        try {
          return new Date(value);
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid date",
          });
          return z.NEVER;
        }
      }),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    // providerImportSource: "@foundations/cms/mdx-components",
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
    remarkPlugins: [remarkMath, remarkInstall],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
