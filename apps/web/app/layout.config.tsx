import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { Icons } from "@/components/icons";

export const title = "Domain UI";
export const description =
  "Domain-first UI components for fintech, trading, KYC, and more. Copy-paste ready components and blocks built specifically for industry use-cases, installable via shadcn CLI.";
export const owner = "domain-ui";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Logo width={36} height={36} />
        <span>Domain UI</span>
      </>
    ),
  },
  links: [],
};

export const linkItems: LinkItemType[] = [
  {
    icon: <Icons.info />,
    text: "Blog",
    url: "/blog",
    active: "url",
  },
  {
    icon: <Icons.info />,
    text: "About",
    url: "/about",
    active: "url",
  },
  // {
  //   icon: <Icons.posts />,
  //   text: "Me",
  //   url: "/me",
  //   active: "url",
  // },
  // {
  //   icon: <Icons.tags />,
  //   text: "Tags",
  //   url: "/tags",
  //   active: "url",
  // },
];

export const postsPerPage = 5;
