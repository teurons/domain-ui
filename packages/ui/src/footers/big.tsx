import { GridBackground } from "@workspace/ui/grid-background";
import { Icons } from "@workspace/ui/icons";

export type FooterNavigationItem = {
  name: string;
  href: string;
};

export type FooterSocialItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type FooterNavigationProps = {
  solutions?: FooterNavigationItem[];
  support?: FooterNavigationItem[];
  company?: FooterNavigationItem[];
  legal?: FooterNavigationItem[];
  social?: FooterSocialItem[];
  companyName?: string;
  companyDescription?: string;
};

export default function BigFooter({
  solutions,
  support,
  company,
  legal,
  social,
  companyName,
  companyDescription,
}: FooterNavigationProps) {
  const navigation = {
    solutions,
    support,
    company,
    legal,
    social,
  };

  return (
    <footer>
      <div className="relative isolate mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <GridBackground maxWidthClass="max-w-7xl" />
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Icons.logo className="h-8 w-8" />
            <p className="text-balance text-gray-600 text-sm/6">
              {companyDescription}
            </p>
            <div className="flex gap-x-6">
              {navigation.social?.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm/6">
                  Solutions
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.solutions?.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 text-sm/6 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-gray-900 text-sm/6">
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.support?.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 text-sm/6 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm/6">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.company?.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 text-sm/6 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-gray-900 text-sm/6">Legal</h3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal?.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 text-sm/6 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-gray-900/10 border-t pt-8 sm:mt-20 lg:mt-24">
          <p className="text-gray-600 text-sm/6">
            &copy; {new Date().getFullYear()} {companyName}, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
