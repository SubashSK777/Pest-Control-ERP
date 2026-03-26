'use client';

import React, { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { 
  PlusIcon, 
  RefreshIcon, 
  SearchIcon, 
  PencilIcon, 
  TrashBinIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  DownloadIcon,
  PrintIcon,
  CopyIcon,
  FileIcon
} from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import Drawer from "@/components/ui/drawer/Drawer";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

// --- Types ---
interface Tax {
  id: number;
  name: string;
  tax_value: number;
  description?: string;
  status: boolean;
  created_at: string;
}

// --- Dummy Data ---
const initialTaxes: Tax[] = [
  { id: 1, name: "GST 5%", tax_value: 5.00, status: true, created_at: "2024-03-01T10:00:00Z" },
  { id: 2, name: "VAT 10%", tax_value: 10.00, status: true, created_at: "2024-03-02T11:00:00Z" },
  { id: 3, name: "Service Tax 18%", tax_value: 18.00, status: true, created_at: "2024-03-03T12:00:00Z" },
  { id: 4, name: "Surcharge 2%", tax_value: 2.00, status: false, created_at: "2024-03-04T13:00:00Z" },
  { id: 5, name: "Cess 1%", tax_value: 1.00, status: true, created_at: "2024-03-05T14:00:00Z" },
  { id: 6, name: "Import Duty 15%", tax_value: 15.00, status: true, created_at: "2024-03-06T15:00:00Z" },
  { id: 7, name: "Excise 8%", tax_value: 8.00, status: true, created_at: "2024-03-07T16:00:00Z" },
  { id: 8, name: "Luxury Tax 28%", tax_value: 28.00, status: false, created_at: "2024-03-08T17:00:00Z" },
];

export default function TaxPage() {
  const [taxes, setTaxes] = useState<Tax[]>(initialTaxes);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tax, direction: 'asc' | 'desc' | null }>({ key: 'id', direction: 'desc' });

  // Form State for Add Tax
  const [formData, setFormData] = useState({
    name: "",
    tax_value: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // --- Handlers ---
  const handleRefresh = () => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setTaxes([...initialTaxes]);
      setLoading(false);
    }, 800);
  };

  const handleSort = (key: keyof Tax) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tax?")) {
      setTaxes(taxes.filter(t => t.id !== id));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Tax name is required";
    if (!formData.tax_value) errors.tax_value = "Tax value is required";
    else if (isNaN(Number(formData.tax_value))) errors.tax_value = "Value must be a number";
    else if (Number(formData.tax_value) < 0 || Number(formData.tax_value) > 100) errors.tax_value = "Range 0-100";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newTax: Tax = {
        id: Math.max(...taxes.map(t => t.id)) + 1,
        name: formData.name,
        tax_value: parseFloat(formData.tax_value),
        description: formData.description,
        status: true,
        created_at: new Date().toISOString()
      };
      setTaxes([newTax, ...taxes]);
      setFormData({ name: "", tax_value: "", description: "" });
      setIsDrawerOpen(false);
    }
  };

  // --- Filtered & Sorted Data ---
  const filteredData = useMemo(() => {
    let result = taxes.filter(tax => 
      tax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tax.tax_value.toString().includes(searchQuery)
    );

    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? "";
        const valB = b[sortConfig.key] ?? "";
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [taxes, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 lg:p-8 custom-scrollbar">
      <PageBreadcrumb pageTitle="Tax" />

      {/* Main Card Container */}
      <div className="bg-white rounded-[12px] border border-gray-300 shadow-theme-sm dark:bg-gray-dark dark:border-gray-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white/90">
              Tax
            </h2>
            <button 
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5 ${loading ? 'animate-spin border-brand-600' : ''}`}
              title="Refresh Data"
            >
              <RefreshIcon className={`w-5 h-5 ${loading ? 'text-brand-600' : 'text-gray-500'}`} />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Export Dropdown */}
            <div className="relative inline-block text-left dropdown flex-1 sm:flex-none">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="dropdown-toggle inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 transition dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 w-full sm:w-auto"
              >
                <DownloadIcon className="w-4 h-4" />
                Export
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              
              <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-48 mt-2 origin-top-right">
                <div className="py-1">
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2">
                       <PrintIcon className="w-4 h-4 text-gray-500" />
                       <span>Print</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2">
                       <CopyIcon className="w-4 h-4 text-gray-500" />
                       <span>Copy</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2 text-green-600">
                       <FileIcon className="w-4 h-4" />
                       <span>Excel</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2 text-blue-600">
                       <FileIcon className="w-4 h-4" />
                       <span>PDF</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2 text-orange-600">
                       <FileIcon className="w-4 h-4" />
                       <span>CSV</span>
                    </div>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>

            {/* Add Tax Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-lg shadow-sm hover:bg-brand-700 transition flex-1 sm:flex-none"
            >
              <PlusIcon className="w-4 h-4 fill-current" />
              Add Tax
            </button>
          </div>
        </div>

        {/* Table Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-sm text-gray-500">Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:border-gray-700"
            >
              {[5, 10, 25, 50, 100].map(val => <option key={val} value={val}>{val}</option>)}
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>

          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tax name or value..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Table Design */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-[#fcfcfd] dark:bg-white/[0.02]">
              <tr>
                {[
                  { label: "S.NO", key: "id" },
                  { label: "ACTIONS", key: null },
                  { label: "TAX NAME", key: "name" },
                  { label: "TAX (%)", key: "tax_value" },
                  { label: "STATUS", key: "status" }
                ].map((col, idx) => (
                  <th 
                    key={idx}
                    onClick={() => col.key && handleSort(col.key as keyof Tax)}
                    className={`px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 ${col.key ? 'cursor-pointer hover:text-gray-700' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.key && (
                        <span className="flex flex-col -gap-1">
                          <ChevronUpIcon className={`w-2.5 h-2.5 ${sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-brand-600' : 'text-gray-300'}`} />
                          <ChevronDownIcon className={`w-2.5 h-2.5 ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-brand-600' : 'text-gray-300'}`} />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.length > 0 ? paginatedData.map((tax, index) => (
                <tr key={tax.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                       <button className="p-1 px-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition rounded-md dark:hover:bg-brand-500/10">
                          <PencilIcon className="w-4 h-4 fill-current" />
                       </button>
                       <button 
                         onClick={() => handleDelete(tax.id)}
                         className="p-1 px-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 transition rounded-md dark:hover:bg-error-500/10"
                       >
                          <TrashBinIcon className="w-4 h-4 fill-current" />
                       </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {tax.name}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {tax.tax_value.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={tax.status ? "success" : "light"} size="sm">
                      {tax.status ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 italic">
                    No tax records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col md:flex-row items-center justify-between p-5 gap-4 bg-[#fcfcfd] dark:bg-white/[0.01]">
          <p className="text-sm text-gray-500">
            Showing {Math.min(filteredData.length, (currentPage - 1) * entriesPerPage + 1)} to {Math.min(filteredData.length, currentPage * entriesPerPage)} of {filteredData.length} entries
          </p>
          
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-gray-700 dark:hover:bg-white/5 transition"
            >
              <ChevronDownIcon className="w-4 h-4 rotate-90" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                  currentPage === i + 1 
                  ? "bg-brand-600 text-white shadow-sm" 
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-gray-700 dark:hover:bg-white/5 transition"
            >
              <ChevronDownIcon className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Tax Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Add Tax"
        width="max-w-[420px]"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tax Name <span className="text-brand-600">*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter tax name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition ${formErrors.name ? 'border-brand-600' : 'border-gray-300 dark:border-gray-700 dark:bg-gray-800'}`}
            />
            {formErrors.name && <span className="text-xs text-brand-600">{formErrors.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tax Value (%) <span className="text-brand-600">*</span>
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="e.g. 5.00"
                value={formData.tax_value}
                onChange={(e) => setFormData({...formData, tax_value: e.target.value})}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition ${formErrors.tax_value ? 'border-brand-600' : 'border-gray-300 dark:border-gray-700 dark:bg-gray-800'}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
            </div>
            {formErrors.tax_value && <span className="text-xs text-brand-600">{formErrors.tax_value}</span>}
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Numeric values only (0-100)</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea 
              rows={4}
              placeholder="Technical details or usage notes..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition dark:border-gray-700 dark:bg-gray-800 resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 pt-6 mt-auto">
            <button 
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition dark:bg-white/5 dark:text-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition"
            >
              Save Tax
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
