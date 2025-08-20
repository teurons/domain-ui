import { docsSource } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createMetadataImage } from "fumadocs-core/server";
import type { Metadata } from "next";
import { baseUrl, createMetadata } from "@workspace/config/metadata";

interface MetadataImageResult {
  getImageMeta: (slugs: string[]) => { alt: string; url: string };
  withImage: (slugs: string[], metadata?: Metadata) => Metadata;
  generateParams: () => { slug: string[] }[];
  createAPI: (handler: any) => any;
}

export const docsMetaImage = createMetadataImage({
  imageRoute: "/docs-og",
  source: docsSource,
}) as MetadataImageResult;

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
      }}
      tableOfContentPopover={{
        enabled: true,
      }}
      lastUpdate={new Date(page.data.lastModified ?? 0)}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  const slug = params.slug ?? [];
  if (!page) {
    notFound();
  }

  const image = ["/docs-og", ...slug, "image.png"].join("/");
  console.log("image", image);

  return createMetadata(
    docsMetaImage.withImage(page.slugs, {
      title: page.data.title,
      description: page.data.description,
      openGraph: {
        url: page.url,
      },
      alternates: {
        canonical: page.url,
      },
    })
  );

  // return {
  //   title: page.data.title,
  //   description: page.data.description,
  //   openGraph: {
  //     images: image,
  //   },
  //   twitter: {
  //     card: "summary_large_image",
  //     images: image,
  //   },
  // };
}
