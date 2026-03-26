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
    }, 800);
  };

  const handlePrint = () => {
    setIsExportOpen(false);
    window.print();
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
    <div className="min-h-screen bg-transparent p-0 md:p-4 transition-colors duration-300">
      <div className="no-print">
        <PageBreadcrumb pageTitle="Tax" />
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-area { border: none !important; box-shadow: none !important; }
          .print-table th, .print-table td { border: 1px solid #eee !important; padding: 8px !important; }
          header, aside, .sidebar { display: none !important; }
        }
      `}</style>

      {/* Main Card Container - Tight Spacing */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-theme-xs dark:bg-gray-900 dark:border-gray-800 overflow-hidden print-area">
        
        {/* Header - Zero Waste Space */}
        <div className="flex items-center justify-between p-3 px-4 border-b border-gray-50 dark:border-gray-800 no-print">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Tax</h2>
            <button onClick={handleRefresh} className="p-0.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded">
              <RefreshIcon className={`w-3 h-3 text-gray-400 ${loading ? 'animate-spin text-brand-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative dropdown">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-800 transition-all"
              >
                <DownloadIcon className="w-2.5 h-2.5" />
                Export
              </button>
              <Dropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} className="w-32 mt-1 !absolute !z-[99] shadow-lg border border-gray-100 dark:border-gray-800 origin-top-right">
                <div className="p-0.5">
                  <DropdownItem onClick={handlePrint} className="text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 py-0.5">
                       <PrintIcon className="w-3 h-3" />
                       <span className="text-[10px]">Print List</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setIsExportOpen(false)} className="text-green-600">
                    <div className="flex items-center gap-1.5 py-0.5">
                       <FileIcon className="w-3 h-3" />
                       <span className="text-[10px]">Excel</span>
                    </div>
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>

            <button 
              onClick={() => { setEditingTax(null); setIsDrawerOpen(true); }}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-all"
            >
              <PlusIcon className="w-2.5 h-2.5 fill-current" />
              Add New
            </button>
          </div>
        </div>

        {/* Search Bar - Ulta-Compact */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50/10 no-print">
          <div className="relative w-48">
            <SearchIcon className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-2 py-1 text-[10px] border border-gray-100 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Table - High Density, No Gaps */}
        <div className="overflow-x-auto">
          <table className="w-full text-left order-separate border-spacing-0 print-table">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.01]">
                <th className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100 dark:border-gray-800 w-10">#</th>
                <th className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100 dark:border-gray-800 w-16 no-print">Action</th>
                <th className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100 dark:border-gray-800">Tax Identity</th>
                <th className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100 dark:border-gray-800 w-20 text-center">Value (%)</th>
                <th className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100 dark:border-gray-800 w-20 text-center">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/20 dark:divide-gray-800/40">
              {paginatedData.map((tax, index) => (
                <tr key={tax.id} className="hover:bg-gray-50/10 transition-colors">
                  <td className="px-3 py-1.5 text-[10px] font-bold text-gray-400">{index + 1}</td>
                  <td className="px-3 py-1.5 no-print">
                    <div className="flex items-center gap-0.5">
                       <button onClick={() => openEditDrawer(tax)} className="p-0.5 text-gray-300 hover:text-brand-600 transition-all"><PencilIcon className="w-2.5 h-2.5 fill-current" /></button>
                       <button onClick={() => { setSelectedTaxId(tax.id); setIsDeleteModalOpen(true); }} className="p-0.5 text-gray-300 hover:text-error-600 transition-all"><TrashBinIcon className="w-2.5 h-2.5 fill-current" /></button>
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300">{tax.name}</td>
                  <td className="px-3 py-1.5 text-center text-[11px] font-bold text-gray-400">{tax.tax_value}%</td>
                  <td className="px-3 py-1.5 text-center">
                    <Badge color={tax.status ? "success" : "light"} size="sm">
                       {tax.status ? "Active" : "Off"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimal Footer */}
        <div className="p-2 px-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between no-print">
           <span className="text-[9px] font-bold text-gray-400 uppercase">Showing {filteredData.length} Items</span>
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); setEditingTax(null); }} title={editingTax ? "Edit Rule" : "New Rule"} width="max-w-[320px]">
        <form onSubmit={handleSave} className="flex flex-col gap-4 p-2">
           <div className="flex flex-col gap-1">
             <span className="text-[9px] font-bold text-gray-400 uppercase">Tax Label</span>
             <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-3 py-1.5 text-xs border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" />
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[9px] font-bold text-gray-400 uppercase">Rate (%)</span>
             <input type="number" step="0.1" value={formData.tax_value} onChange={e => setFormData({...formData, tax_value: e.target.value})} className="px-3 py-1.5 text-xs border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" />
           </div>
           <button type="submit" className="px-3 py-2 bg-brand-600 text-white font-bold text-[10px] rounded uppercase tracking-widest shadow-lg">Commit Change</button>
        </form>
      </Drawer>

      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setTaxes(taxes.filter(t => t.id !== selectedTaxId))} />
    </div>
  );
}
