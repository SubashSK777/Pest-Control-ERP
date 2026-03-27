"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  DatabaseIcon,
  VehicleIcon,
  UserIcon,
  CalendarIcon,
  BugIcon,
  UsersIcon,
  StockIcon,
  DollarIcon,
  FileIcon,
  MessageIcon,
  CreditCardIcon,
  WatchIcon,
  EyeIcon,
  MapIcon,
  SearchIcon,
  PieChartIcon,
  BarChartIcon,
  BarChartDollarIcon,
  TrendUpIcon,
  ShieldIcon,
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons/index";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <DatabaseIcon />,
    name: "Master",
    subItems: [
      { name: "Tax", path: "/master/tax" },
      { name: "Company Origin", path: "/master/company-origin" },
      { name: "Service Frequency", path: "/master/service-frequency" },
      { name: "Billing Frequency", path: "/master/billing-frequency" },
      { name: "Unit Of Measurement", path: "/master/uom" },
      { name: "Call Type", path: "/master/call-type" },
      { name: "Industry", path: "/master/industry" },
      { name: "Holidays", path: "/master/holidays" },
      { name: "Incident", path: "/master/incident" },
      { name: "Todo Items", path: "/master/todo-items" },
      { name: "Site Risk", path: "/master/site-risk" },
      { name: "Equipments", path: "/master/equipments" },
    ],
  },
  {
    icon: <VehicleIcon />,
    name: "Vehicle",
    path: "/vehicle",
  },
  {
    icon: <UserIcon />,
    name: "Employee",
    subItems: [
      { name: "Department", path: "/employee/department" },
      { name: "Designation", path: "/employee/designation" },
      { name: "Employee List", path: "/employee/list" },
      { name: "Employee Leave Type", path: "/employee/leave-type" },
      { name: "User Privilege", path: "/employee/privilege" },
    ],
  },
  {
    icon: <CalendarIcon />,
    name: "Employee Leaves",
    path: "/employee-leaves",
  },
  {
    icon: <BugIcon />,
    name: "Service Type (Pest)",
    path: "/service-type",
  },
  {
    icon: <UsersIcon />,
    name: "Customers",
    path: "/customers",
  },
  {
    icon: <StockIcon />,
    name: "Purchase & Stock",
    subItems: [
      { name: "Suppliers", path: "/purchase-stock/suppliers" },
      { name: "Chemicals", path: "/purchase-stock/chemicals" },
      { name: "Purchase Order", path: "/purchase-stock/order" },
      { name: "Purchase Inward", path: "/purchase-stock/inward" },
      { name: "Purchase Return", path: "/purchase-stock/return" },
      { name: "Material Request", path: "/purchase-stock/request" },
      { name: "Material Issue", path: "/purchase-stock/issue" },
      { name: "Material Return", path: "/purchase-stock/material-return" },
      { name: "Stock Summary", path: "/purchase-stock/summary" },
      { name: "Vehicle Stock Summary", path: "/purchase-stock/vehicle-summary" },
      { name: "Material Usage", path: "/purchase-stock/usage" },
    ],
  },
  {
    icon: <DollarIcon />,
    name: "Sales",
    subItems: [
      { name: "Proposal Content", path: "/sales/proposal-content" },
      { name: "Sales Proposal", path: "/sales/proposal" },
    ],
  },
  {
    icon: <FileIcon />,
    name: "Contracts",
    path: "/contracts",
  },
  {
    icon: <MessageIcon />,
    name: "Service Request",
    path: "/service-request",
  },
  {
    icon: <CalendarIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <CreditCardIcon />,
    name: "Invoice",
    path: "/invoice",
  },
  {
    icon: <WatchIcon />,
    name: "Attendance",
    subItems: [
      { name: "Slots", path: "/attendance/slots" },
      { name: "Attendance", path: "/attendance/records" },
      { name: "Schedule", path: "/attendance/schedule" },
      { name: "Attendance Timesheet", path: "/attendance/timesheet" },
      { name: "Payslip Summary Report", path: "/attendance/payslip-report" },
    ],
  },
  {
    icon: <EyeIcon />,
    name: "View Contract Status",
    path: "/contract-status",
  },
  {
    icon: <MapIcon />,
    name: "Map",
    path: "/map",
  },
];

const finderItems: NavItem[] = [
  { name: "Non Pre-Schedule", icon: <SearchIcon />, path: "/finder/non-pre-schedule" },
  { name: "Backlog Finder", icon: <SearchIcon />, path: "/finder/backlog" },
  { name: "Followup Finder", icon: <SearchIcon />, path: "/finder/followup" },
  { name: "KIV Finder", icon: <SearchIcon />, path: "/finder/kiv" },
  { name: "Productivity Finder", icon: <SearchIcon />, path: "/finder/productivity" },
];

const reportItems: NavItem[] = [
  { name: "Service Summary Report", icon: <PieChartIcon />, path: "/reports/service-summary" },
  { name: "RIC / Follow-up Report", icon: <BarChartIcon />, path: "/reports/ric-followup" },
  { name: "Productivity Summary", icon: <BarChartDollarIcon />, path: "/reports/productivity" },
  { name: "SCDF Report", icon: <FileIcon />, path: "/reports/scdf" },
  { name: "Sales Report", icon: <DollarIcon />, path: "/reports/sales" },
  { name: "Pest Trending", icon: <TrendUpIcon />, path: "/reports/pest-trending" },
];

const auditItems: NavItem[] = [
  { name: "Customer Audit", icon: <ShieldIcon />, path: "/audit/customer" },
  { name: "Contracts Audit", icon: <ShieldIcon />, path: "/audit/contracts" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: string
  ) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive(subItem.path)
                              ? "bg-brand-500"
                              : "bg-gray-400 dark:bg-gray-600"
                          }`}
                        ></span>
                        {subItem.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    let submenuMatched = false;
    const allGroups = [
      { type: "main", items: navItems },
      { type: "finder", items: finderItems },
      { type: "reports", items: reportItems },
      { type: "audit", items: auditItems },
    ];

    allGroups.forEach((group) => {
      group.items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: group.type,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                src="/images/logo/logo-light-full.png"
                alt="Logo"
                width={160}
                height={50}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark-full.png"
                alt="Logo"
                width={160}
                height={50}
                className="hidden dark:block"
              />
            </>
          ) : (
            <>
              <Image
                src="/images/logo/logo-light-icon.png"
                alt="Logo"
                width={35}
                height={35}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark-icon.png"
                alt="Logo"
                width={35}
                height={35}
                className="hidden dark:block"
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Finder"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(finderItems, "finder")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Reports"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(reportItems, "reports")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Audit Trial"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(auditItems, "audit")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};


export default AppSidebar;
