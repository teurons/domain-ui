import { docsSource } from "@workspace/cms/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { docsMetaImage } from "@workspace/cms/metadata-image";
import { createMetadata } from "@workspace/config/metadata";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{
        enabled: false,
      }}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
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
  console.log("params.slug", params.slug);
  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

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
}
