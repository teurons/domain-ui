import { generateOGImage } from "fumadocs-ui/og";
import {
  generateOgImageStaticParams,
  generateOGImageMetadata,
} from "@workspace/fumadocs-blog/blog";
import {
  blogConstants,
  getCategoryBySlug,
  getSeriesBySlug,
} from "@/blog-configuration";
import { blogSource, getBlogPosts } from "@/lib/source";

export const contentType = "image/png";
export const dynamic = "force-static";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;

  // console.log("resolvedParams", resolvedParams);

  const metadata = generateOGImageMetadata(resolvedParams, {
    blogConstants,
    getCategoryBySlug,
    getSeriesBySlug,
    blogSource,
  });

  return generateOGImage({
    title: metadata.title,
    // description: metadata.description,
    site: "domain-ui.dev",
  });
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  const imageRoutes = await generateOgImageStaticParams(blogSource, posts);

  // console.log("imageRoutes", imageRoutes);

  return imageRoutes;
}
