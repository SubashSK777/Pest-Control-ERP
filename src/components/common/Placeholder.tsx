import React from "react";
import PageBreadcrumb from "./PageBreadCrumb";

interface PlaceholderProps {
  title: string;
  description?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  return (
    <>
      <PageBreadcrumb pageTitle={title} />
      <div className="grid grid-cols-1">
        <div className="rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-white/[0.03] md:p-10">
          <div className="mb-8">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                {title}
             </h2>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                {title} Module
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                {description || "This section is currently under development. Stay tuned for future updates to the A-Flick Pest Management Portal."}
              </p>
              <div className="mt-8 flex justify-center">
                <span className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
                  Ready for Development
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Placeholder;
