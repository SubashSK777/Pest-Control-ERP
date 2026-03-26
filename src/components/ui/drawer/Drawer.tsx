'use client';

import React, { useEffect } from "react";
import { CloseIcon } from "@/icons";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = "max-w-md" 
}) => {
  // Prevent scrolling on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[999998] bg-black/40 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 z-[999999] h-screen w-full ${width} bg-white shadow-2xl transition-transform duration-500 ease-in-out dark:bg-gray-900 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
              {title}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 transition rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <CloseIcon className="w-5 h-5 fill-current" />
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
