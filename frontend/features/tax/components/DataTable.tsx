import React from 'react';
import { PencilIcon, TrashBinIcon } from '@/icons';
import Icon from './Icon';
import Badge from './Badge';

const mockTaxes = [
  { id: 1, sNo: 1, name: "Tx9", value: 9, status: "Active" },
  { id: 2, sNo: 2, name: "Tx8", value: 8, status: "Active" },
  { id: 3, sNo: 3, name: "N-T", value: 0, status: "Active" },
  { id: 4, sNo: 4, name: "TX7", value: 7, status: "Active" },
];

const DataTable = () => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2a3042] shadow-2xl shadow-black/30">
      <table className="w-full text-sm text-left table-fixed min-w-[600px]">
        <thead className="bg-[#1f2433] bg-opacity-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          <tr>
            <th className="w-[60px] px-6 py-4">S.No</th>
            <th className="w-[100px] px-6 py-4">Actions</th>
            <th className="px-6 py-4">Tax Name</th>
            <th className="w-[120px] px-6 py-4">Tax (%)</th>
            <th className="w-[140px] px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {mockTaxes.map((tax) => (
            <tr key={tax.id} className="transition-all hover:bg-white/5 cursor-pointer">
              <td className="px-6 py-4 font-medium text-gray-300">{tax.sNo}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button className="p-1.5 transition-all text-emerald-500 bg-emerald-500/10 rounded-lg hover:bg-emerald-500 hover:text-white group">
                    <Icon icon={PencilIcon} className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 transition-all text-rose-500 bg-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white group">
                    <Icon icon={TrashBinIcon} className="w-4 h-4" />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-white">{tax.name}</td>
              <td className="px-6 py-4 text-gray-300 font-inter">{tax.value}%</td>
              <td className="px-6 py-4">
                <Badge variant={tax.status === 'Active' ? 'success' : 'error'}>
                  {tax.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
