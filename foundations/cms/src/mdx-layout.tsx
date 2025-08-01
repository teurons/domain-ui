import type { TableOfContents, TOCItemType } from "fumadocs-core/server";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import type { ReactNode } from "react";
import { cn } from "@workspace/shadverse/lib/utils";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { sortedByDatePageTree } from "@foundations/cms/source";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { GridBackground } from "@workspace/ui/grid-background";

interface MdxLayoutProps {
  children: ReactNode;
  title: string;
  toc?: TableOfContents;
}

const PageHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className="border-grid border-b">
    <div className="container-wrapper">
      <div className={cn("container py-6 px-4", className)}>{children}</div>
    </div>
  </div>
);

export default function MdxLayout({
  children,
  title,
  toc,
}: MdxLayoutProps): ReactNode {
  return (
    <>
      <DocsLayout
        nav={{ enabled: false }}
        tree={{
          name: "JustMDX",
          children: [],
        }}
        sidebar={{ enabled: false, prefetch: false, tabs: false }}
        containerProps={{
          className: "relative max-w-7xl mx-auto md:[--fd-nav-height:59px]",
        }}
      >
        <GridBackground maxWidthClass="max-w-7xl" />

        <DocsPage
          toc={toc}
          full={false}
          footer={{
            enabled: false,
          }}
          tableOfContent={{
            style: "clerk",
            single: false,
          }}
          article={{
            className: "!max-w-[1120px]",
          }}
        >
          <DocsTitle>{title}</DocsTitle>

          <DocsBody>{children}</DocsBody>
        </DocsPage>
      </DocsLayout>
    </>
  );
}
