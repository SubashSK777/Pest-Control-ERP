'use client';

import React from "react";
import { CloseIcon, AlertIcon } from "@/icons";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Tax",
  message = "Are you sure you want to delete this tax record? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl dark:bg-gray-900 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500">
               <AlertIcon className="w-6 h-6 fill-current" />
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition dark:hover:text-white"
            >
              <CloseIcon className="w-5 h-5 fill-current" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
          
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition dark:bg-white/5 dark:text-gray-300"
            >
              No, Keep it
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-error-600 rounded-lg hover:bg-error-700 transition shadow-sm shadow-error-600/20"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
