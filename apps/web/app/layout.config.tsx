import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { Icons } from "@/components/icons";

export const title = "domain-ui";
export const description =
  "Personal website of domain-ui. This is where I articulate my work, open source projects, thoughts, ideas, work, commentary and opinions.";
export const owner = "domain-ui";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Logo width={28} height={28} />
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
