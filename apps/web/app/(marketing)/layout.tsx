import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import SimpleFooter from "@workspace/ui/footers/simple";
import { Icons } from "@workspace/ui/icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { baseOptions, linkItems } from "@/app/layout.config";
import { getLinks } from "fumadocs-ui/layouts/shared";
import { Header } from "@/components/header";

// const baseOptions: BaseLayoutProps = {
//   githubUrl: "https://github.com/rjvim/saas-foundations",
//   nav: {
//     title: (
//       <>
//         <svg
//           width="24"
//           height="24"
//           xmlns="http://www.w3.org/2000/svg"
//           aria-label="Logo"
//         >
//           <circle cx={12} cy={12} r={12} fill="currentColor" />
//         </svg>
//         Domain UI
//       </>
//     ),
//   },
//   links: [
//     {
//       text: "Documentation",
//       url: "/primitives/docs",
//       active: "nested-url",
//     },
//     {
//       text: "Blog",
//       url: "/blog",
//     },
//     {
//       text: "About",
//       url: "/about",
//       active: "nested-url",
//     },
//   ],
// };

export default function Layout({ children }: { children: ReactNode }) {
  const footerNavigation = [
    {
      name: "Twitter",
      href: "https://twitter.com/rjv_im",
      icon: Icons.x,
    },
    {
      name: "GitHub",
      href: "https://github.com/teurons/domain-ui",
      icon: Icons.github,
    },
  ];

  return (
    <HomeLayout
      {...baseOptions}
      // nav={{
      //   component: (
      //     <Header
      //       finalLinks={getLinks(linkItems, baseOptions.githubUrl)}
      //       {...baseOptions}
      //     />
      //   ),
      // }}
      // className="pt-0"
    >
      <div className="home-children flex flex-1 flex-col divide-y divide-dashed divide-border/70 border-border/70 border-dashed sm:border-b dark:divide-border dark:border-border">
        {children}
      </div>
      <SimpleFooter navigation={footerNavigation} />
      {/* <GridBackground maxWidthClass="max-w-7xl" /> */}
    </HomeLayout>
  );
}
