'use client';
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon, RefreshIcon, DownloadIcon, PlusIcon, ChevronDownIcon } from "@/icons";

// Mock Data (matches prompt)
const tableData = [
  { id: 1, sNo: 1, name: "Tx9", value: 9, status: "Active" },
  { id: 2, sNo: 2, name: "Tx8", value: 8, status: "Active" },
  { id: 3, sNo: 3, name: "N-T", value: 0, status: "Active" },
  { id: 4, sNo: 4, name: "TX7", value: 7, status: "Active" },
];

export default function TaxPage() {
  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="Tax" />

      {/* Page Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Tax
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600">
            <RefreshIcon className="w-4 h-4 fill-current" />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.05]">
              Export
              <ChevronDownIcon className="w-4 h-4 fill-current" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600">
            <PlusIcon className="w-4 h-4 fill-current" />
            Add Tax
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Show</span>
              <select className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300">
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num} className="bg-white dark:bg-gray-900">
                    {num}
                  </option>
                ))}
              </select>
              <span className="text-sm font-medium text-gray-500">entries</span>
            </div>

            <div className="relative w-full max-w-sm">
              <input
                type="search"
                placeholder="Search tax name or value..."
                className="w-full pl-4 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.02]">
            <div className="max-w-full overflow-x-auto">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader className="border-b border-gray-50 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
                  <TableRow>
                    <TableCell isHeader className="w-[60px] px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider">
                      S.NO
                    </TableCell>
                    <TableCell isHeader className="w-[100px] px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider">
                      ACTIONS
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider">
                      TAX NAME
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider">
                      TAX (%)
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider">
                      STATUS
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                  {tableData.map((tax) => (
                    <TableRow key={tax.id} className="hover:bg-gray-50/10 transition-colors">
                      <TableCell className="w-[60px] px-5 py-4 text-start font-medium text-gray-400 text-theme-sm">
                        {tax.sNo}
                      </TableCell>
                      <TableCell className="w-[100px] px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                            <PencilIcon className="w-5 h-5 fill-current" />
                          </button>
                          <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
                            <TrashBinIcon className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center font-bold text-gray-800 text-theme-sm dark:text-white/90">
                        {tax.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400 font-bold">
                        {tax.value}%
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex justify-center">
                          <Badge size="sm" color="success">
                            {tax.status}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between px-2">
            <div className="text-sm font-medium text-gray-500">
              Showing 1 to 4 of 4 entries
            </div>

            <div className="inline-flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
              {['First', 'Prev'].map((p) => (
                <button key={p} className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  {p}
                </button>
              ))}
              <button className="px-4 py-2 text-xs font-black transition-all bg-brand-500 rounded-lg text-white">
                1
              </button>
              {['Next', 'Last'].map((n) => (
                <button key={n} className="px-4 py-2 text-xs font-bold uppercase transition-all text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  {n}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
