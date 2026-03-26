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

// --- Types ---
interface Tax {
  id: number;
  name: string;
  tax_value: number;
  status: boolean;
}

const tableData: Tax[] = [
  { id: 1, name: "GST 5%", tax_value: 5.0, status: true },
  { id: 2, name: "VAT 10%", tax_value: 10.0, status: true },
  { id: 3, name: "Service Tax 18%", tax_value: 18.0, status: true },
  { id: 4, name: "Surcharge 2%", tax_value: 2.0, status: false },
  { id: 5, name: "Cess 1%", tax_value: 1.0, status: true },
];

export default function TaxPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tax" />
      <div className="grid grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:px-10 md:pt-4 md:pb-10 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 text-left">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                Tax Detail
             </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.02]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-50 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider">
                      #
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider">
                      Tax Identity
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider">
                      Rate (%)
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                  {tableData.map((tax, index) => (
                    <TableRow key={tax.id} className="hover:bg-gray-50/10 transition-colors group">
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-400 text-theme-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-bold text-gray-800 text-theme-sm dark:text-white/90">
                          {tax.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <span className="text-gray-500 text-theme-sm dark:text-gray-400 font-bold">
                          {tax.tax_value.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <Badge
                          size="sm"
                          color={tax.status ? "success" : "light"}
                        >
                          {tax.status ? "Active" : "Off"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
