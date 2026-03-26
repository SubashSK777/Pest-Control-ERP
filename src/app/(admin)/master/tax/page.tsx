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
  { id: 1, name: "GST 5%", tax_value: 5.0, status: true, created_at: "2024-03-01T10:00:00Z" },
  { id: 2, name: "VAT 10%", tax_value: 10.0, status: true, created_at: "2024-03-02T11:00:00Z" },
  { id: 3, name: "Service Tax 18%", tax_value: 18.0, status: true, created_at: "2024-03-03T12:00:00Z" },
  { id: 4, name: "Surcharge 2%", tax_value: 2.0, status: false, created_at: "2024-03-04T13:00:00Z" },
  { id: 5, name: "Cess 1%", tax_value: 1.0, status: true, created_at: "2024-03-05T14:00:00Z" },
  { id: 6, name: "Import Duty 15%", tax_value: 15.0, status: true, created_at: "2024-03-06T15:00:00Z" },
  { id: 7, name: "Excise 8%", tax_value: 8.0, status: true, created_at: "2024-03-07T16:00:00Z" },
  { id: 8, name: "Luxury Tax 28%", tax_value: 28.0, status: false, created_at: "2024-03-08T17:00:00Z" },
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tax, direction: 'asc' | 'desc' | null }>({ key: 'id', direction: 'desc' });

  // Form State
  const [formData, setFormData] = useState({ name: "", tax_value: "" });

  useEffect(() => {
    if (editingTax) {
      setFormData({ name: editingTax.name, tax_value: editingTax.tax_value.toString() });
    } else {
      setFormData({ name: "", tax_value: "" });
    }
  }, [editingTax]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setTaxes([...initialTaxes]); }, 500);
  };

  const handleSort = (key: keyof Tax) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const openEditDrawer = (tax: Tax) => {
    setEditingTax(tax);
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTax) {
      setTaxes(taxes.map(t => t.id === editingTax.id ? { ...t, name: formData.name, tax_value: parseFloat(formData.tax_value) } : t));
    } else {
      setTaxes([{ id: Date.now(), name: formData.name, tax_value: parseFloat(formData.tax_value), status: true, created_at: new Date().toISOString() }, ...taxes]);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a202c] md:p-4 transition-colors">
      <div className="no-print">
        <PageBreadcrumb pageTitle="Tax" />
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
          .print-table { width: 100% !important; border-collapse: collapse !important; font-family: sans-serif; }
          .print-table th, .print-table td { border: 1px solid #ddd !important; padding: 6px !important; text-align: left !important; font-size: 10pt !important; }
          header, [role="navigation"], .breadcrumb { display: none !important; }
        }
      `}</style>

      {/* Main Card Container - Material-ish Premium Feel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-[#2d3748] dark:border-gray-700/50 overflow-hidden print-area mx-auto max-w-5xl">
        
        {/* Header - Unified with Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 dark:border-gray-700/30 no-print">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-gray-800 dark:text-gray-100 uppercase">Tax Management</h1>
            <button onClick={handleRefresh} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 group">
              <RefreshIcon className={`w-3 h-3 text-gray-400 group-hover:text-brand-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative inline-block dropdown">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 dark:bg-white/5 dark:border-gray-700 dark:text-gray-400"
              >
                <DownloadIcon className="w-2.5 h-2.5" />
                Export
              </button>
              <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-36 mt-1 !absolute !z-50 shadow-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#2d3748] origin-top-right">
                <div className="p-1">
                  <DropdownItem onClick={() => { setIsExportOpen(false); window.print(); }}>
                    <div className="flex items-center gap-2">
                       <PrintIcon className="w-3 h-3 text-gray-400" />
                       <span className="text-[10px] font-bold">Print Table</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)} className="text-green-600">
                    <div className="flex items-center gap-2">
                       <FileIcon className="w-3 h-3" />
                       <span className="text-[10px] font-bold">Download Excel</span>
                    </div>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>

            <button 
              onClick={() => { setEditingTax(null); setIsDrawerOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 active:scale-95"
            >
              <PlusIcon className="w-2.5 h-2.5 fill-current" />
              Add Tax
            </button>
          </div>
        </div>

        {/* Filter - Compact & Aligned */}
        <div className="px-5 py-3 flex items-center justify-between gap-4 no-print bg-gray-25/30 dark:bg-white/[0.01]">
          <div className="relative flex-1 max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-[11px] font-medium bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Found {filteredData.length} entries
          </div>
        </div>

        {/* The Table - Tight Columns to Prevent "Huge Gap" */}
        <div className="overflow-x-auto">
          <table className="w-full text-left order-separate border-spacing-0 print-table">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                <th className="px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/30 w-12 text-center">S#</th>
                <th className="px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/30 w-20 no-print">Manage</th>
                <th className="px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/30">Tax Identity</th>
                <th className="px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/30 w-32 text-center">Tax (%)</th>
                <th className="px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/30 w-32 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-25 dark:divide-gray-700/20">
              {filteredData.map((tax, index) => (
                <tr key={tax.id} className="hover:bg-gray-50/20 dark:hover:bg-white/[0.005] group">
                  <td className="px-5 py-2 text-[11px] font-bold text-gray-300 dark:text-gray-500 text-center">
                    {index + 1}
                  </td>
                  <td className="px-5 py-2 no-print">
                    <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => openEditDrawer(tax)} className="p-1 px-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-all">
                          <PencilIcon className="w-3 h-3 fill-current" />
                       </button>
                       <button onClick={() => { setSelectedTaxId(tax.id); setIsDeleteModalOpen(true); }} className="p-1 px-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 rounded transition-all">
                          <TrashBinIcon className="w-3 h-3 fill-current" />
                       </button>
                    </div>
                  </td>
                  <td className="px-5 py-2 text-[12px] font-bold text-gray-800 dark:text-gray-100">
                    {tax.name}
                  </td>
                  <td className="px-5 py-2 text-center text-[12px] font-bold text-gray-500 dark:text-gray-400">
                    {tax.tax_value.toFixed(1)}%
                  </td>
                  <td className="px-5 py-2 text-center">
                    <Badge color={tax.status ? "success" : "light"} size="sm">
                       {tax.status ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popups & Modals */}
      <Drawer isOpen={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); setEditingTax(null); }} title={editingTax ? "Edit Tax Entry" : "Create Tax Entry"} width="max-w-[340px]">
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-2">
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
             <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-3 py-2 text-[12px] border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-500" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Percentage Value</label>
             <input type="number" step="0.1" value={formData.tax_value} onChange={e => setFormData({...formData, tax_value: e.target.value})} className="px-3 py-2 text-[12px] border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-500" />
           </div>
           <button type="submit" className="mt-4 px-4 py-2.5 bg-brand-600 text-white font-bold text-[11px] rounded-lg tracking-widest uppercase hover:bg-brand-700 shadow-xl shadow-brand-600/10">Confirm Changes</button>
        </form>
      </Drawer>

      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setTaxes(taxes.filter(t => t.id !== selectedTaxId))} />
    </div>
  );
}
