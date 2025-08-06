import { GridBackground } from "../grid-background";

export interface FooterNavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function SimpleFooter({
  navigation,
}: {
  navigation: FooterNavigationItem[];
}) {
  return (
    <footer>
      <div className="relative isolate mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <GridBackground maxWidthClass="max-w-7xl" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-gray-600 text-sm md:text-left">
            &copy; 2025 Domain UI. Built by{" "}
            <a
              href="https://twitter.com/rjv_im"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @rjv_im
            </a>{" "}
            under{" "}
            <a
              href="https://twitter.com/teurons"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @teurons
            </a>
          </p>

          <div className="flex gap-x-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
