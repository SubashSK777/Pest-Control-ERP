import React from "react";

interface PlaceholderProps {
  title: string;
  description?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] sm:p-10">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            {description || "This section is currently under development. Stay tuned for future updates to the Pest Management Portal."}
          </p>
          <div className="mt-8 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
              Placeholder Page
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
