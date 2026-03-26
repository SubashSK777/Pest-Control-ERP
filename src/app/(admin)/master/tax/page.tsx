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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTaxes([...initialTaxes]);
      setLoading(false);
    }, 1200);
  };

  const handleExport = (type: string) => {
    setIsExportOpen(false);
    // Open a dummy link to simulate export action in a new tab
    const dummyUrl = `https://mock-export-service.app/export?type=${type}&module=tax&data_count=${taxes.length}`;
    window.open(dummyUrl, '_blank');
  };

  const handleSort = (key: keyof Tax) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { setFormErrors({ name: "Required" }); return; }
    if (editingTax) {
      setTaxes(taxes.map(t => t.id === editingTax.id ? { ...t, name: formData.name, tax_value: parseFloat(formData.tax_value) } : t));
    } else {
      setTaxes([{ id: Date.now(), ...formData, tax_value: parseFloat(formData.tax_value), status: true, created_at: new Date().toISOString() }, ...taxes]);
    }
    setIsDrawerOpen(false);
    setEditingTax(null);
  };

  const filteredData = useMemo(() => {
    let result = taxes.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-6 transition-colors duration-300">
      <PageBreadcrumb pageTitle="Tax" />

      {/* Main Card Container - Unified Dark Styling */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-theme-sm dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        
        {/* Header - Compact Icons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 border-b border-gray-100 dark:border-gray-800 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Tax
            </h2>
            <button 
              onClick={handleRefresh}
              className="p-1 rounded-md border border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all flex items-center justify-center"
            >
              <RefreshIcon 
                className={`w-4 h-4 text-gray-400 dark:text-gray-500 ${loading ? 'animate-spin text-brand-500' : ''}`} 
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative dropdown">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800 transition-all"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                Export
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              
              <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-40 mt-1 !absolute !z-[99] shadow-xl border border-gray-100 dark:border-gray-800 origin-top-right">
                <div className="p-1">
                  <DropdownItem onClick={() => handleExport('print')}>
                    <div className="flex items-center gap-2">
                       <PrintIcon className="w-3.5 h-3.5 opacity-60" />
                       <span className="text-xs">Print</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => handleExport('excel')} className="text-green-600 dark:text-green-500">
                    <div className="flex items-center gap-2">
                       <FileIcon className="w-3.5 h-3.5" />
                       <span className="text-xs">Excel</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => handleExport('pdf')} className="text-blue-600 dark:text-blue-400">
                    <div className="flex items-center gap-2">
                       <FileIcon className="w-3.5 h-3.5" />
                       <span className="text-xs">PDF</span>
                    </div>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>

            <button 
              onClick={() => { setEditingTax(null); setIsDrawerOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm transition-all"
            >
              <PlusIcon className="w-3.5 h-3.5 fill-current" />
              Add Tax
            </button>
          </div>
        </div>

        {/* Controls - Minimalized Icons */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              {[10, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Quick search tax rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Table - Optimized Dimensions and Alignment */}
        <div className="overflow-x-auto">
          <table className="w-full text-left order-separate border-spacing-0">
            <thead className="bg-gray-25 dark:bg-white/[0.01]">
              <tr>
                {[
                  { label: "S.NO", key: "id", w: "w-16" },
                  { label: "ACTIONS", key: null, w: "w-24" },
                  { label: "TAX NAME", key: "name", w: "min-w-[120px]" },
                  { label: "TAX (%)", key: "tax_value", w: "w-24 text-center" },
                  { label: "STATUS", key: "status", w: "w-24 text-center" }
                ].map((col, i) => (
                  <th 
                    key={i}
                    onClick={() => col.key && handleSort(col.key as keyof Tax)}
                    className={`px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 ${col.key ? 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-300' : ''} ${col.w}`}
                  >
                    <div className={`flex items-center gap-1 ${col.w.includes('center') ? 'justify-center' : ''}`}>
                      {col.label}
                      {col.key && (
                        <div className="flex flex-col items-center -gap-0.5">
                          <ChevronUpIcon className={`w-2.5 h-1.5 ${sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-brand-600' : 'opacity-20'}`} />
                          <ChevronDownIcon className={`w-2.5 h-1.5 ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-brand-600' : 'opacity-20'}`} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {paginatedData.map((tax, index) => (
                <tr key={tax.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.005] transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-gray-400 border-b border-gray-50/50 dark:border-gray-800/40">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-50/50 dark:border-gray-800/40">
                    <div className="flex items-center gap-1">
                       <button onClick={() => openEditDrawer(tax)} className="p-1 px-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md dark:hover:bg-brand-500/10 transition-all">
                          <PencilIcon className="w-3.5 h-3.5 fill-current" />
                       </button>
                       <button onClick={() => { setSelectedTaxId(tax.id); setIsDeleteModalOpen(true); }} className="p-1 px-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-md dark:hover:bg-error-500/10 transition-all">
                          <TrashBinIcon className="w-3.5 h-3.5 fill-current" />
                       </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-50/50 dark:border-gray-800/40 text-xs font-bold text-gray-700 dark:text-gray-300">
                    {tax.name}
                  </td>
                  <td className="px-4 py-3 text-center border-b border-gray-50/50 dark:border-gray-800/40 text-xs font-bold text-gray-500 dark:text-gray-400">
                    {tax.tax_value.toFixed(1)} %
                  </td>
                  <td className="px-4 py-3 text-center border-b border-gray-50/50 dark:border-gray-800/40">
                    <Badge color={tax.status ? "success" : "light"} size="sm">
                      {tax.status ? "Live" : "Idle"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Minimal Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 gap-3 bg-gray-50/20 dark:bg-white/[0.005]">
          <p className="text-[11px] font-bold text-gray-400">Total {filteredData.length} records</p>
          <div className="flex items-center gap-1">
             <button disabled className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 opacity-30"><ChevronDownIcon className="w-3 h-3 rotate-90" /></button>
             <span className="w-8 h-8 flex items-center justify-center bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm">1</span>
             <button disabled className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 opacity-30"><ChevronDownIcon className="w-3 h-3 -rotate-90" /></button>
          </div>
        </div>
      </div>

      {/* Popups Integrated with Theme */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Tax Entry" width="max-w-[380px]">
        <form onSubmit={handleSave} className="flex flex-col gap-6 p-1">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Tax Name</span>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-4 py-2 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Value (%)</span>
            <input type="number" step="0.1" value={formData.tax_value} onChange={e => setFormData({...formData, tax_value: e.target.value})} className="px-4 py-2 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button type="submit" className="mt-4 px-4 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 transition-all shadow-md">Confirm Save</button>
        </form>
      </Drawer>

      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setTaxes(taxes.filter(t => t.id !== selectedTaxId))} />
    </div>
  );
}
