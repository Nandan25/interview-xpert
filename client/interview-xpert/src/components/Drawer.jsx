import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  // Handle Esc key to close drawer
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col 
        w-full h-[85vh] bottom-0 md:h-screen md:top-0 md:bottom-auto md:right-0 md:w-[40vw] 
        border-t md:border-t-0 md:border-l border-gray-200 rounded-t-2xl md:rounded-l-xl 
        ${
          isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
