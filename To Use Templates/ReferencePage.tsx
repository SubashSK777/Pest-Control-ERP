'use client';
import React from "react";
import PageBreadcrumb from "./PageBreadCrumb";

interface ReferencePageProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Standard A-Flick CRM Module Template
 * Use this as a reference for all new modules.
 */
const ReferencePage: React.FC<ReferencePageProps> = ({ title, description, children }) => {
  return (
    <>
      <PageBreadcrumb pageTitle={title} />
      <div className="grid grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col min-h-[400px]">
            {children || (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                  {title} Module
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                  {description || "This section is currently under development. Stay tuned for future updates to the A-Flick Pest Management Portal."}
                </p>
                <div className="mt-8">
                  <span className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
                    Ready for Development
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferencePage;
