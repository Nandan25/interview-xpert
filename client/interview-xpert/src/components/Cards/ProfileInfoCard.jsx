import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { FaUser } from "react-icons/fa6";

export const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="flex items-center gap-2 sm:gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 max-w-full">
        <img
          src={user?.picture || ""}
          alt="Profile"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 truncate">
            {user?.name || ""}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm text-amber-600 font-medium hover:underline hover:text-amber-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};
