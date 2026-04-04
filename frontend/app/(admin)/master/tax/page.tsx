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
  AngleUpIcon,
  AngleDownIcon,
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

type SortDirection = 'asc' | 'desc' | 'default';

export default function TaxPage() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tax, direction: SortDirection }>({ key: 'id', direction: 'default' });
  const [pageSize, setPageSize] = useState(10);
  
  // Modals & UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTax, setCurrentTax] = useState<Partial<Tax>>({ name: '', value: 0, status: 'Active' });
  const [taxToDelete, setTaxToDelete] = useState<number | null>(null);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/taxes/`);
      if (!res.ok) throw new Error("Failed to fetch taxes");
      const data = await res.json();
      
      const mappedData: Tax[] = data.map((t: any, index: number) => ({
        id: t.id,
        sNo: index + 1,
        name: t.name,
        value: Number(t.tax_value),
        status: t.status ? "Active" : "Inactive"
      }));
      setTaxes(mappedData);
    } catch (err) {
      console.error("Fetch error:", err);
      // Fallback to empty if fetch fails to avoid showing stale initialData
      setTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleSort = (key: keyof Tax) => {
    setSortConfig((prev: { key: keyof Tax, direction: SortDirection }) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'default') return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: 'id', direction: 'default' }; 
    });
  };

  const handleRefresh = () => {
    fetchTaxes();
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

  const handleSave = async () => {
    if (!currentTax.name || currentTax.value === undefined) {
      alert("Name and Tax (%) are compulsory.");
      return;
    }

    const payload = {
      name: currentTax.name,
      tax_value: currentTax.value,
      status: currentTax.status === 'Active',
      description: "" 
    };

    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const endpoint = modalMode === 'add' 
        ? `${BACKEND_URL}/api/taxes/` 
        : `${BACKEND_URL}/api/taxes/${currentTax.id}/`;
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Could not save tax");
      }
      
      setIsModalOpen(false);
      fetchTaxes();
    } catch (err: any) {
      alert(`Failed to save tax: ${err.message}`);
    }
  };

  const confirmDelete = (id: number) => {
    setTaxToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (taxToDelete !== null) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/taxes/${taxToDelete}/`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error("Could not delete tax");
        
        setIsDeleteModalOpen(false);
        setTaxToDelete(null);
        fetchTaxes();
      } catch (err) {
        alert("Failed to delete tax");
      }
    }
  };

  // --- Export Logic ---
  const handleExport = (format: 'print' | 'csv' | 'excel' | 'pdf' | 'copy') => {
    setIsExportOpen(false);
    
    // Define headers and structure
    const headers = ["S.No", "Tax Name", "Tax %", "Status"];
    const exportData = sortedData.map((t: Tax) => ({
      "S.No": t.sNo,
      "Tax Name": t.name,
      "Tax %": t.value,
      "Status": t.status
    }));

    if (format === 'print' || format === 'pdf') {
        window.print();
        return;
    }
    
    if (format === 'copy') {
        const text = [headers.join('\t'), ...exportData.map((t: any) => Object.values(t).join('\t'))].join('\n');
        navigator.clipboard.writeText(text);
        alert("Table content copied to clipboard!");
        return;
    }

    if (format === 'csv' || format === 'excel') {
        const separator = format === 'csv' ? ',' : '\t';
        const fileExtension = format === 'csv' ? 'csv' : 'xls';
        const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel';
        
        // CSV/Excel Content Creation
        const csvContent = [
            headers.join(separator),
            ...exportData.map((row: any) => 
                Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(separator)
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `tax_report_${new Date().getTime()}.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
        <AngleUpIcon className={`w-2.5 h-2.5 fill-current ${active && direction === 'asc' ? 'text-brand-500' : ''}`} />
        <AngleDownIcon className={`w-2.5 h-2.5 fill-current ${active && direction === 'desc' ? 'text-brand-500' : ''}`} />
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
            .print-header { display: block !important; margin-bottom: 20px; text-align: center; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: center; font-size: 10pt; }
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
            className="flex items-center justify-center px-3 py-1.5 min-w-[100px] text-sm font-medium text-white transition-colors bg-brand-500 rounded-xl hover:bg-brand-600 group shadow-sm"
          >
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center justify-center gap-2 px-3 py-1.5 min-w-[100px] text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.05] shadow-sm"
            >
              Export
              <ChevronDownIcon className={`w-4 h-4 fill-current transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>
            <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-[120px] rounded-2xl shadow-xl border-white/[0.05]">
                <DropdownItem onClick={() => handleExport('print')} className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0">Print</DropdownItem>
                <DropdownItem onClick={() => handleExport('csv')} className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0">CSV</DropdownItem>
                <DropdownItem onClick={() => handleExport('excel')} className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0">Excel</DropdownItem>
                <DropdownItem onClick={() => handleExport('pdf')} className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0">PDF</DropdownItem>
                <DropdownItem onClick={() => handleExport('copy')} className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 border-t border-gray-100 dark:border-white/5 mt-1 px-0">Copy</DropdownItem>
            </Dropdown>
          </div>
          
          <button 
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-xl hover:bg-brand-600 shadow-sm"
          >
            <PlusIcon className="w-5 h-5 fill-current flex-shrink-0 translate-y-[2px]" />
            <span>Add Tax</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div id="printable-area" className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          
          {/* Print Only Header */}
          <div className="hidden print-header">
            <h1 className="text-2xl font-bold text-gray-900 uppercase">A-Flick Pest Control ERP</h1>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Tax Master List</h2>
            <p className="text-sm font-medium text-gray-600 mt-2">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between print-exclude">
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">show</span>
              <div className="relative">
                <button 
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 min-w-[70px] text-sm bg-white border border-gray-200 rounded-xl text-gray-700 dark:bg-gray-900 dark:border-white/[0.1] dark:text-gray-300 outline-none focus:ring-1 focus:ring-brand-500 shadow-sm transition-all text-center cursor-pointer font-bold"
                >
                  {pageSize}
                  <ChevronDownIcon className={`w-4 h-4 fill-current transition-transform ${isPageSizeOpen ? 'rotate-180' : ''}`} />
                </button>
                <Dropdown isOpen={isPageSizeOpen} onClose={() => setIsPageSizeOpen(false)} className="w-[70px] rounded-2xl shadow-xl border-white/[0.1] right-auto left-0 overflow-hidden">
                    {[10, 25, 50, 100].map((num) => (
                      <DropdownItem 
                        key={num} 
                        onClick={() => { setPageSize(num); setIsPageSizeOpen(false); }} 
                        className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0 font-bold"
                      >
                        {num}
                      </DropdownItem>
                    ))}
                </Dropdown>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">entries</span>
            </div>

            <div className="relative w-full max-sm:max-w-none max-w-sm">
              <input
                type="search"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search tax..."
                className="w-full pl-4 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm transition-all"
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

        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
            <div className="relative">
                <button 
                  type="button"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="flex items-center justify-between w-full h-11 px-4 text-sm bg-theme-white border border-gray-200 rounded-lg text-gray-700 dark:bg-gray-900 dark:border-white/[0.05] dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  {currentTax.status}
                  <ChevronDownIcon className={`w-4 h-4 fill-current transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                </button>
                <Dropdown isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} className="w-full rounded-xl shadow-xl border-white/[0.1] right-0 left-0 overflow-hidden mt-1">
                    {["Active", "Inactive"].map((status) => (
                      <DropdownItem 
                        key={status} 
                        onClick={() => { setCurrentTax({...currentTax, status: status as any}); setIsStatusOpen(false); }} 
                        className="justify-center text-center hover:bg-brand-500/10 dark:hover:bg-brand-500/20 px-0"
                      >
                        {status}
                      </DropdownItem>
                    ))}
                </Dropdown>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-md"
            >
              {modalMode === 'add' ? 'Save Tax' : 'Update Tax'}
            </button>
          </div>
        </form>
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
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-2 font-outfit">
            Confirm Delete
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 px-4">
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
