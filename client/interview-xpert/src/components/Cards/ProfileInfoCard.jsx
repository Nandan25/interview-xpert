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
    <div className="flex items-center">
      <div className="w-11 h-11 bg-gray-300 rounded-full mr-3">
        <FaUser className="text-white text-xl" />{" "}
      </div>
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {(user && user.name) || ""}
        </div>
        <button
          className="text-amber-600 font-semibold text-sm cursor-pointer"
          onClick={handleLogout}
        >
          {"Logout"}
        </button>
      </div>
    </div>
  );
};
