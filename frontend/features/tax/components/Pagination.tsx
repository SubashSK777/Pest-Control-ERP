import React from 'react';

const Pagination = () => {
  return (
    <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between px-2">
      <div className="text-sm font-medium text-gray-500 font-inter">
        Showing 1 to 4 of <span className="text-white font-bold">4</span> entries
      </div>

      <div className="inline-flex items-center gap-1.5 p-1 bg-[#1f2433] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <button className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 bg-white/5 rounded-lg hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
          First
        </button>
        <button className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 bg-white/5 rounded-lg hover:text-white hover:bg-white/10 active:scale-95">
          Prev
        </button>
        <button className="px-4 py-2 text-xs font-black transition-all bg-rose-600 rounded-lg text-rose-50 hover:bg-rose-700 active:scale-95 font-inter">
          1
        </button>
        <button className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 bg-white/5 rounded-lg hover:text-white hover:bg-white/10 active:scale-95">
          Next
        </button>
        <button className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 bg-white/5 rounded-lg hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
