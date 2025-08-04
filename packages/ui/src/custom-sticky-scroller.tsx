import type React from "react";
type StickyContent = {
  title?: string;
  details?: string;
  image_url: string;
};
type Props = {
  children: React.ReactNode;
  stickyContent: StickyContent;
};
const CustomStickyScroller = ({ children, stickyContent }: Props) => {
  return (
    <div className="mobile:ml-2 flex w-full flex-col gap-6 py-8 lg:flex-row">
      {/* Main Content */}
      <div className="right flex w-full flex-col items-start rounded-2xl border border-slate-200 shadow-lg lg:w-[50%] dark:border-neutral-700">
        {children}
      </div>
      {/* Sidebar Container */}
      <div className="right relative w-full lg:w-[50%]">
        <div className="flex flex-col items-start gap-3">
          {stickyContent.title && (
            <span className="font-inter font-semibold text-5xl text-[#101828] leading-[45px] tracking-[-0.96px] dark:text-gray-100">
              {stickyContent.title}
            </span>
          )}
          {stickyContent.details && (
            <span className="font-inter font-normal text-[#475467] text-xl leading-[30px] dark:text-gray-300">
              {stickyContent.details}
            </span>
          )}
        </div>
        <div className="sticky top-8 hidden lg:block">
          <div className=" flex flex-col items-start gap-4 p-4">
            <img
              className="hidden max-w-60 lg:block"
              src={stickyContent.image_url}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomStickyScroller;
