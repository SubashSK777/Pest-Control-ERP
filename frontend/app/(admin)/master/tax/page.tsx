'use client';
import React, { useState, useMemo, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { 
  PencilIcon, 
  TrashBinIcon, 
  PlusIcon, 
  ChevronDownIcon,
} from "@/icons";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

// --- Types ---
interface Tax {
  id: number;
  sNo: number;
  name: string;
  value: number;
  status: "Active" | "Inactive";
}

const initialData: Tax[] = [
  { id: 1, sNo: 1, name: "Tx9", value: 9, status: "Active" },
  { id: 2, sNo: 2, name: "Tx8", value: 8, status: "Active" },
  { id: 3, sNo: 3, name: "N-T", value: 0, status: "Active" },
  { id: 4, sNo: 4, name: "TX7", value: 7, status: "Active" },
];

type SortDirection = 'asc' | 'desc' | 'default';

export default function TaxPage() {
  const [taxes, setTaxes] = useState<Tax[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tax, direction: SortDirection }>({ key: 'id', direction: 'default' });
  const [pageSize, setPageSize] = useState(10);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTax, setCurrentTax] = useState<Partial<Tax>>({ name: '', value: 0, status: 'Active' });
  const [taxToDelete, setTaxToDelete] = useState<number | null>(null);

  // Dropdown States
  const [isExportOpen, setIsExportOpen] = useState(false);

  // --- Handlers ---
  const handleSort = (key: keyof Tax) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'default') return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: 'id', direction: 'default' }; 
    });
  };

  const handleRefresh = () => {
    setTaxes([...initialData]);
    setSearchTerm("");
    setSortConfig({ key: 'id', direction: 'default' });
  };

  const openAddModal = () => {
    setModalMode('add');
    setCurrentTax({ name: '', value: 0, status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (tax: Tax) => {
    setModalMode('edit');
    setCurrentTax(tax);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentTax.name || currentTax.value === undefined) {
      alert("Name and Tax (%) are compulsory.");
      return;
    }

    if (modalMode === 'add') {
      const newTax: Tax = {
        ...currentTax as Tax,
        id: Math.max(0, ...taxes.map(t => t.id)) + 1,
        sNo: taxes.length + 1,
      };
      setTaxes([...taxes, newTax]);
    } else {
      setTaxes(taxes.map((t: Tax) => t.id === currentTax.id ? (currentTax as Tax) : t));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setTaxToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (taxToDelete !== null) {
      setTaxes(taxes.filter((t: Tax) => t.id !== taxToDelete));
      setIsDeleteModalOpen(false);
      setTaxToDelete(null);
    }
  };

  // --- Export Logic ---
  const handleExport = async (format: 'print' | 'csv' | 'excel' | 'pdf' | 'copy') => {
    setIsExportOpen(false);
    const exportData = sortedData.map(t => ({
      "S.No": t.sNo,
      "Tax Name": t.name,
      "Tax %": t.value,
      "Status": t.status
    }));

    if (format === 'print') {
        window.print();
        return;
    }
    
    if (format === 'copy') {
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        alert("Copied to clipboard!");
        return;
    }

    // Logic for Excel, CSV, PDF - Sending to Python View
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/crm/tax/export/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ format, data: exportData })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tax_report_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            alert("Export failed on server. Ensure backend export endpoint is available.");
        }
    } catch (err) {
        console.error("Export Error:", err);
        alert("Failed to connect to export server.");
    }
  };

  // --- Filtered & Sorted Data ---
  const filteredData = useMemo(() => {
    return taxes.filter((tax: Tax) => 
      tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.value.toString().includes(searchTerm)
    );
  }, [taxes, searchTerm]);

  const sortedData = useMemo(() => {
    if (sortConfig.direction === 'default') {
      return [...filteredData].sort((a, b) => b.id - a.id); 
    }
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const displayData = useMemo(() => {
    return sortedData.slice(0, pageSize);
  }, [sortedData, pageSize]);

  // --- UI Helpers ---
  const SortIcon = ({ column }: { column: keyof Tax }) => {
    const active = sortConfig.key === column;
    const direction = sortConfig.direction;
    
    return (
      <div className="inline-flex flex-col ml-1 align-middle opacity-50 group-hover:opacity-100 transition-opacity">
        <i className={`bi bi-caret-up-fill text-[8px] leading-[8px] ${active && direction === 'asc' ? 'text-brand-500' : ''}`}></i>
        <i className={`bi bi-caret-down-fill text-[8px] leading-[8px] ${active && direction === 'desc' ? 'text-brand-500' : ''}`}></i>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Print-only CSS */}
      <style>{`
        @media print {
            body * { visibility: hidden; }
            #printable-area, #printable-area * { visibility: visible; }
            #printable-area { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                background: white !important;
                padding: 20px;
            }
            #printable-area .print-exclude { display: none !important; }
            .print-header { display: block !important; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
            tr { page-break-inside: avoid; }
        }
      `}</style>

      <PageBreadcrumb pageTitle="Tax" />

      {/* Page Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Tax
          </h2>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 group"
          >
            <i className="bi bi-arrow-clockwise text-lg"></i>
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="dropdown-toggle flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Export
              <ChevronDownIcon className={`w-4 h-4 fill-current transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>
            <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-[150px]">
                <DropdownItem onClick={() => handleExport('print')}>Print</DropdownItem>
                <DropdownItem onClick={() => handleExport('csv')}>CSV</DropdownItem>
                <DropdownItem onClick={() => handleExport('excel')}>Excel</DropdownItem>
                <DropdownItem onClick={() => handleExport('pdf')}>PDF</DropdownItem>
                <DropdownItem onClick={() => handleExport('copy')}>Copy</DropdownItem>
            </Dropdown>
          </div>
          
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            <PlusIcon className="w-4 h-4 fill-current" />
            Add Tax
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div id="printable-area" className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          
          {/* Print Only Header */}
          <div className="hidden print-header">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 uppercase">A-Flick Pest Control ERP</h1>
                <p className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Tax Master List</h2>
          </div>

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between print-exclude">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Show</span>
              <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 dark:bg-gray-900 dark:border-white/[0.05] dark:text-gray-300 outline-none focus:ring-1 focus:ring-brand-500 min-w-[70px] cursor-pointer"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span className="text-sm font-medium text-gray-500">entries</span>
            </div>

            <div className="relative w-full max-sm:max-w-none max-w-sm">
              <input
                type="search"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search tax name or value..."
                className="w-full pl-4 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.02]">
            <div className="max-w-full overflow-x-auto">
              <Table className="table-fixed min-w-[800px] border-collapse">
                <TableHeader className="border-b border-gray-50 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
                  <TableRow>
                    <TableCell 
                      isHeader 
                      onClick={() => handleSort('sNo')}
                      className="w-[100px] px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider cursor-pointer group hover:text-brand-500"
                    >
                      S.NO
                      <SortIcon column="sNo" />
                    </TableCell>
                    <TableCell isHeader className="w-[120px] px-5 py-3 font-bold text-gray-500 text-start text-xs dark:text-gray-400 uppercase tracking-wider print-exclude">
                      ACTIONS
                    </TableCell>
                    <TableCell 
                      isHeader 
                      onClick={() => handleSort('name')}
                      className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider cursor-pointer group hover:text-brand-500"
                    >
                      TAX NAME
                      <SortIcon column="name" />
                    </TableCell>
                    <TableCell 
                      isHeader 
                      onClick={() => handleSort('value')}
                      className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider cursor-pointer group hover:text-brand-500"
                    >
                      TAX (%)
                      <SortIcon column="value" />
                    </TableCell>
                    <TableCell 
                      isHeader 
                      onClick={() => handleSort('status')}
                      className="px-5 py-3 font-bold text-gray-500 text-center text-xs dark:text-gray-400 uppercase tracking-wider cursor-pointer group hover:text-brand-500"
                    >
                      STATUS
                      <SortIcon column="status" />
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                  {displayData.map((tax: Tax) => (
                    <TableRow key={tax.id} className="hover:bg-gray-50/10 transition-colors">
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-400 text-theme-sm">
                        {tax.sNo}
                      </TableCell>
                      <TableCell className="px-5 py-4 print-exclude">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openEditModal(tax)}
                            className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                          >
                            <PencilIcon className="w-5 h-5 fill-current" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(tax.id)}
                            className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                          >
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
                          <Badge size="sm" color={tax.status === 'Active' ? 'success' : 'light'}>
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

          <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between px-2 print-exclude">
            <div className="text-sm font-medium text-gray-500">
              Showing 1 to {displayData.length} of {sortedData.length} entries
            </div>
            {/* Pagination UI - Placeholder */}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="max-w-[500px] p-8"
      >
        <div className="mb-6 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4">
            {modalMode === 'add' ? 'Add New Tax' : 'Edit Tax'}
          </h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Name <span className="text-rose-500">*</span></Label>
            <Input 
              placeholder="e.g. VAT 10%" 
              value={currentTax.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTax({...currentTax, name: e.target.value})}
            />
          </div>

          <div>
            <Label>Tax Value (%) <span className="text-rose-500">*</span></Label>
            <Input 
              type="number" 
              placeholder="e.g. 10" 
              value={currentTax.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTax({...currentTax, value: Number(e.target.value)})}
            />
          </div>

          <div>
            <Label>Status</Label>
            <select 
              value={currentTax.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentTax({...currentTax, status: e.target.value as any})}
              className="w-full h-11 px-4 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 dark:bg-gray-900 dark:border-white/[0.05] dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            {modalMode === 'add' ? 'Save Tax' : 'Update Tax'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        className="max-w-[400px] p-6 text-center"
      >
        <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10 text-error-500">
                <i className="bi bi-exclamation-triangle text-3xl"></i>
            </div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-2">
            Confirm Delete
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Are you sure you want to delete this tax record? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
          >
            No, Keep it
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-error-500 rounded-lg hover:bg-error-600"
          >
            Yes, Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
