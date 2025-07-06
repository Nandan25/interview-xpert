import React from "react";
import { ProfileInfoCard } from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 pt-6 relative z-10">
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-gradient-to-r from-[#fff9f0] to-white rounded-md w-full">
        <div className="text-2xl font-semibold text-gray-900 tracking-wide">
          Interview<span className="text-orange-500">Xpert</span>
        </div>
        <ProfileInfoCard />
      </header>
    </div>
  );
};

export default Navbar;
