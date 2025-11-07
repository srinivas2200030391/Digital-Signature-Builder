"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Home,
  FileSignature,
  CheckCircle,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.from(itemsRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    // Track hash changes
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    // Set initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      href: "#",
      icon: Home,
    },
    {
      name: "Create Signature",
      href: "#signature",
      icon: FileSignature,
    },
    {
      name: "My Documents",
      href: "#documents",
      icon: FileText,
    },
    {
      name: "Verify Signature",
      href: "#verify",
      icon: CheckCircle,
    },
    {
      name: "Profile",
      href: "#profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "#settings",
      icon: Settings,
    },
  ];

  const handleItemHover = (index: number) => {
    const item = itemsRef.current[index];
    if (item) {
      gsap.to(item, {
        x: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleItemLeave = (index: number) => {
    const item = itemsRef.current[index];
    if (item) {
      gsap.to(item, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
          >
            <FileSignature className="w-6 h-6 text-white" />
          </motion.div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Digital Signature
              </h2>
              <p className="text-xs text-muted-foreground">Builder</p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeHash === item.href || (item.href === '#' && activeHash === '');

          return (
            <a
              key={item.name}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              href={item.href}
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={() => handleItemLeave(index)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileOpen ? 0 : -300 }}
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50",
          className
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={{ width: isOpen ? 280 : 80 }}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden lg:flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-border sticky top-0",
          className
        )}
      >
        {sidebarContent}
        
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
}
