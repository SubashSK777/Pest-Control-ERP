import React from 'react';
import Breadcrumb from './components/Breadcrumb';
import PageHeader from './components/PageHeader';
import TableControls from './components/TableControls';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';

const TaxFeature = () => {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 bg-[#1f2433] text-white">
      <div className="mx-auto w-full max-w-7xl">
        <Breadcrumb />
        <PageHeader />
        
        <div className="relative group">
          <div className="absolute -inset-1 blur-3xl opacity-20 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-3xl" />
          <div className="relative p-6 sm:p-8 border bg-[#2a3042] border-white/10 rounded-3xl shadow-3xl shadow-black/50 overflow-hidden group-hover:bg-[#2e344a] transition-colors duration-500">
            <TableControls />
            <DataTable />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxFeature;
