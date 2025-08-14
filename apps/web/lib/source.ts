// .source folder will be generated when you run `next dev`
import { docs, blog, essentialsDocs } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

export const primitivesDocsSource = loader({
  baseUrl: "/primitives/docs",
  source: docs.toFumadocsSource(),
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(blog),
});

export const essentialsDocsSource = loader({
  baseUrl: "/essentials",
  source: createMDXSource(essentialsDocs),
});

export const {
  getPage: getBlogPost,
  getPages: getBlogPosts,
  pageTree: pageBlogTree,
} = blogSource;

export const { getPage: getEssentialsDoc, getPages: getEssentialsDocs } =
  essentialsDocsSource;

export type BlogPost = ReturnType<typeof getBlogPost>;
export type EssentialsDoc = ReturnType<typeof getEssentialsDoc>;
