import CustomStickyScroller from "./custom-sticky-scroller";

import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const PPScrollerSection = () => {
  const dataContent = {
    scrollingContent: [
      {
        title: "Billing",
        description:
          "Support recurring business models, minimise churn, and automate finance operations.",
        heading: "Capture recurring revenue",
        buttonText: "Start with Billing",
        features: [
          {
            title: "Invoicing",
            content: "for invoice creation, collection, and tracking",
          },
          {
            title: "Revenue Recognition",
            content: "for streamlined accrual accounting",
          },
          {
            title: "Sigma",
            content: "for custom revenue reports",
          },
        ],
      },
      {
        title: "Connect",
        description:
          "Integrate payments into your platform or marketplace for end-to-end payments experiences.",
        heading: "Set up multi-party payments and payouts",
        buttonText: "Start with Connect",
        features: [
          {
            title: "Terminal",
            content: "for custom in-person payments",
          },
          {
            title: "Instant Payouts",
            content: "for fast payments to users",
          },
          {
            title: "Payment Elements",
            content: "for customisable UIs",
          },
        ],
      },
      {
        title: "Payments",
        description:
          "Increase authorisation rates, optimise your checkout conversion, and offer local payment methods in every market.",
        heading: "Accept and optimise payments, globally",
        buttonText: "Start with Payments",
        features: [
          {
            title: "Tax",
            content: "for automating sales tax and VAT",
          },
          {
            title: "Radar",
            content: "for fraud prevention and management",
          },
          {
            title: "Terminal",
            content: "for custom in-person payments",
          },
        ],
      },
      {
        title: "Issuing",
        description:
          "Launch, manage, and scale a commercial card programme without any setup fees.",
        heading: "Build a fintech offering with banking-as-a-service",
        buttonText: "Start with Issuing",
        features: [
          {
            title: "Treasury",
            content: "for financial accounts",
          },
          {
            title: "Capital",
            content: "for offering fast, flexible financing",
          },
          {
            title: "Connect",
            content: "for powering platform payments",
          },
        ],
      },
    ],
    StickyContent: {
      image_url:
        "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-04.png",
    },
  };
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start px-6 py-4 lg:gap-y-8 lg:px-8">
      {/* New Scroller Component with a single sticky image for all the sections */}
      <CustomStickyScroller stickyContent={dataContent?.StickyContent}>
        {dataContent?.scrollingContent?.map((item) => {
          return (
            <div key={item.title} className="h-screen space-y-4 p-8">
              <p className="my-0 font-sans font-semibold text-gray-900 text-xl dark:text-white">
                {item?.title}
              </p>
              <p className="my-0 font-sans font-semibold text-5xl text-gray-900 dark:text-white">
                {item?.heading}
              </p>
              <p className="my-0 font-normal font-sans text-base text-gray-600 dark:text-gray-400">
                {item?.description}
              </p>
              <button
                type="button"
                className="flex w-fit items-center gap-x-2 rounded-3xl border-none bg-mf-stack-blue-dark px-3.5 py-2 font-semibold text-white hover:cursor-pointer hover:bg-mf-stack-blue"
              >
                {item?.buttonText}
                <ArrowRightIcon height={16} width={16} />
              </button>
              <p className="my-0 font-sans font-semibold text-base text-gray-900 dark:text-white">
                See Also
              </p>
              <div>
                {item?.features?.map((feature: { title: string; content: string }, featureIndex) => (
                  <p
                    key={`feature-${featureIndex}`}
                    className="my-0 font-normal font-sans text-black text-sm dark:text-white"
                  >
                    <span
                      className="mr-2 font-sans font-semibold text-mf-stack-purple-primary text-sm dark:text-mf-stack-purple-light"
                    >
                      {feature?.title}
                    </span>
                    {feature?.content}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </CustomStickyScroller>
    </div>
  );
};
