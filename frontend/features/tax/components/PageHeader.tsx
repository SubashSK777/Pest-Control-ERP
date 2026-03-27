import React from 'react';
import { RefreshIcon, PlusIcon, ChevronDownIcon } from '@/icons';
import Icon from './Icon';

const PageHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Tax</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all bg-rose-600 rounded-lg text-rose-50 hover:bg-rose-700 active:scale-95">
          <Icon icon={RefreshIcon} />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border rounded-lg bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
            Export
            <Icon icon={ChevronDownIcon} />
          </button>
          {/* Mock Dropdown */}
          <div className="absolute right-0 z-20 hidden w-40 mt-2 transition-all opacity-0 shadow-2xl group-hover:block group-hover:opacity-100 bg-[#2a3042] border border-white/10 rounded-xl overflow-hidden translate-y-2 group-hover:translate-y-0 duration-200">
            <div className="py-2">
              {['Print', 'CSV', 'Excel', 'PDF', 'Copy'].map((item) => (
                <button key={item} className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:bg-white/5 hover:text-white">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all bg-rose-600 rounded-lg text-rose-50 hover:bg-rose-700 active:scale-95">
          <Icon icon={PlusIcon} />
          Add Tax
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
