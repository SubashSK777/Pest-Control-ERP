import React from 'react';
import { SearchIcon } from '@/icons';
import Icon from './Icon';

const TableControls = () => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500">Show</span>
        <select className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50 appearance-none min-w-[70px] cursor-pointer hover:bg-white/10 transition-colors">
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num} className="bg-[#1f2433]">
              {num}
            </option>
          ))}
        </select>
        <span className="text-sm font-medium text-gray-500 font-inter">entries</span>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-50">
          <Icon icon={SearchIcon} className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder="Search tax name or value..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all hover:bg-white/10"
        />
      </div>
    </div>
  );
};

export default TableControls;
