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
import DeleteConfirmModal from "@/components/tax/DeleteConfirmModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaxId, setSelectedTaxId] = useState<number | null>(null);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tax, direction: 'asc' | 'desc' | null }>({ key: 'id', direction: 'desc' });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tax_value: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // --- Effect: Sync Form when Editing ---
  useEffect(() => {
    if (editingTax) {
      setFormData({
        name: editingTax.name,
        tax_value: editingTax.tax_value.toString(),
        description: editingTax.description || ""
      });
    } else {
      setFormData({ name: "", tax_value: "", description: "" });
    }
  }, [editingTax]);

  // --- Handlers ---
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTaxes([...initialTaxes]);
      setLoading(false);
    }, 1200);
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

  const openDeleteModal = (id: number) => {
    setSelectedTaxId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTaxId) {
      setTaxes(taxes.filter(t => t.id !== selectedTaxId));
      setSelectedTaxId(null);
    }
  };

  const openEditDrawer = (tax: Tax) => {
    setEditingTax(tax);
    setIsDrawerOpen(true);
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
      if (editingTax) {
        setTaxes(taxes.map(t => t.id === editingTax.id ? {
          ...t,
          name: formData.name,
          tax_value: parseFloat(formData.tax_value),
          description: formData.description
        } : t));
      } else {
        const newTax: Tax = {
          id: taxes.length > 0 ? Math.max(...taxes.map(t => t.id)) + 1 : 1,
          name: formData.name,
          tax_value: parseFloat(formData.tax_value),
          description: formData.description,
          status: true,
          created_at: new Date().toISOString()
        };
        setTaxes([newTax, ...taxes]);
      }
      setIsDrawerOpen(false);
      setEditingTax(null);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
      <PageBreadcrumb pageTitle="Tax" />

      {/* Main Card Container */}
      <div className="bg-white rounded-[14px] border border-gray-300 shadow-theme-xs dark:bg-gray-900/50 dark:border-gray-800 overflow-hidden backdrop-blur-sm">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/95">
              Tax
            </h2>
            <button 
              onClick={handleRefresh}
              className="p-1.5 rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5 group"
              title="Refresh Data"
            >
              <RefreshIcon 
                className={`w-5 h-5 transition-transform duration-700 ${loading ? 'animate-spin text-brand-600' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'}`} 
              />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Export Dropdown */}
            <div className="relative inline-block text-left dropdown flex-1 sm:flex-none">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="dropdown-toggle inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 transition dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 w-full sm:w-auto"
              >
                <DownloadIcon className="w-4 h-4" />
                Export
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-48 mt-2 origin-top-right !absolute !z-50 shadow-2xl">
                <div className="p-1">
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2.5">
                       <PrintIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                       <span>Print</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)}>
                    <div className="flex items-center gap-2.5">
                       <CopyIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                       <span>Copy</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)} className="!text-green-600 dark:!text-green-500 hover:!bg-green-50 dark:hover:!bg-green-500/10">
                    <div className="flex items-center gap-2.5">
                       <FileIcon className="w-4 h-4" />
                       <span>Excel</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)} className="!text-blue-600 dark:!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-500/10">
                    <div className="flex items-center gap-2.5">
                       <FileIcon className="w-4 h-4" />
                       <span>PDF</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)} className="!text-orange-600 dark:!text-orange-500 hover:!bg-orange-50 dark:hover:!bg-orange-500/10">
                    <div className="flex items-center gap-2.5">
                       <FileIcon className="w-4 h-4" />
                       <span>CSV</span>
                    </div>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>

            {/* Add Tax Button */}
            <button 
              onClick={() => { setEditingTax(null); setIsDrawerOpen(true); }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-lg shadow-sm hover:bg-brand-700 transition flex-1 sm:flex-none active:scale-[0.98]"
            >
              <PlusIcon className="w-4 h-4 fill-current" />
              Add Tax
            </button>
          </div>
        </div>

        {/* Table Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 gap-4">
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 transition-all"
            >
              {[5, 10, 25, 50, 100].map(val => <option key={val} value={val}>{val}</option>)}
            </select>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">entries</span>
          </div>

          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by tax name or value..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500 transition-all"
            />
          </div>
        </div>

        {/* Table Design */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left order-separate border-spacing-0">
            <thead className="bg-gray-50 dark:bg-white/[0.02]">
              <tr>
                {[
                  { label: "S.NO", key: "id", width: "w-20" },
                  { label: "ACTIONS", key: null, width: "w-32" },
                  { label: "TAX NAME", key: "name", width: "w-auto" },
                  { label: "TAX (%)", key: "tax_value", width: "w-32" },
                  { label: "STATUS", key: "status", width: "w-32" }
                ].map((col, idx) => (
                  <th 
                    key={idx}
                    onClick={() => col.key && handleSort(col.key as keyof Tax)}
                    className={`px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 ${col.key ? 'cursor-pointer hover:text-gray-800 dark:hover:text-gray-300 transition-colors' : ''} ${col.width}`}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.key && (
                        <div className="flex flex-col items-center -gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <ChevronUpIcon className={`w-3 h-2.5 ${sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-brand-600 scale-125 opacity-100' : ''}`} />
                          <ChevronDownIcon className={`w-3 h-2.5 ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-brand-600 scale-125 opacity-100' : ''}`} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.length > 0 ? paginatedData.map((tax, index) => (
                <tr key={tax.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-100 dark:border-gray-800/50">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-1.5">
                       <button 
                         onClick={() => openEditDrawer(tax)}
                         className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all rounded-lg dark:hover:bg-brand-500/10 focus:ring-1 focus:ring-brand-500/20"
                         title="Edit Record"
                       >
                          <PencilIcon className="w-4.5 h-4.5 fill-current" />
                       </button>
                       <button 
                         onClick={() => openDeleteModal(tax.id)}
                         className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 transition-all rounded-lg dark:hover:bg-error-500/10 focus:ring-1 focus:ring-error-500/20"
                         title="Delete Record"
                       >
                          <TrashBinIcon className="w-4.5 h-4.5 fill-current" />
                       </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {tax.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {tax.tax_value.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
                    <Badge color={tax.status ? "success" : "light"} size="sm" variant="light">
                      {tax.status ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 dark:text-gray-600 italic text-sm">
                    No tax records found matching your current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 gap-4 bg-gray-50/50 dark:bg-white/[0.01]">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold">{Math.min(filteredData.length, (currentPage - 1) * entriesPerPage + 1)}</span> to <span className="font-bold">{Math.min(filteredData.length, currentPage * entriesPerPage)}</span> of <span className="font-bold text-gray-800 dark:text-gray-300">{filteredData.length}</span> entries
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-white/5 transition-all text-gray-500 dark:text-gray-400"
            >
              <ChevronDownIcon className="w-4 h-4 rotate-90" />
            </button>
            
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    currentPage === i + 1 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" 
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-white/5 transition-all text-gray-500 dark:text-gray-400"
            >
              <ChevronDownIcon className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Tax Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); setEditingTax(null); }} 
        title={editingTax ? "Edit Tax" : "Add Tax"}
        width="max-w-[420px]"
      >
        <form onSubmit={handleSave} className="flex flex-col h-full gap-6">
          <div className="space-y-6 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Tax Name <span className="text-brand-600">*</span>
              </label>
              <input 
                type="text"
                placeholder="e.g. Sales Tax, GST"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`px-4 py-3 text-sm font-medium border rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all ${formErrors.name ? 'border-brand-600 ring-2 ring-brand-600/10' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'}`}
              />
              {formErrors.name && <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">{formErrors.name}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Tax Value (%) <span className="text-brand-600">*</span>
              </label>
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="0.00"
                  value={formData.tax_value}
                  onChange={(e) => setFormData({...formData, tax_value: e.target.value})}
                  className={`w-full px-4 py-3 text-sm font-medium border rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all ${formErrors.tax_value ? 'border-brand-600 ring-2 ring-brand-600/10' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-brand-600 transition-colors">%</span>
              </div>
              {formErrors.tax_value && <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">{formErrors.tax_value}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea 
                rows={5}
                placeholder="Details of the tax rule..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="px-4 py-3 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button"
              onClick={() => { setIsDrawerOpen(false); setEditingTax(null); }}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all dark:bg-white/5 dark:text-gray-300 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-600/20 transition-all active:scale-[0.98]"
            >
              {editingTax ? "Update Tax" : "Save Tax"}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Custom Delete Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
