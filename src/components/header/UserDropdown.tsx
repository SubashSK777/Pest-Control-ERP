"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500">
          <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm text-gray-800 dark:text-white/90">Admin</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
            Admin
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            dev@aflick.com
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-3 px-3 py-2.5 font-semibold text-white bg-error-600 rounded-lg hover:bg-error-700 transition-colors text-theme-sm"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
