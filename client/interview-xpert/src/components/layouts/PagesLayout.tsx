import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../../context/userContext";

function PagesLayout({ children }) {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />

      {<>{children}</>}

      <footer className="bg-gradient-to-r from-orange-50 to-yellow-50 text-gray-700 text-center py-6 mt-16 border-t border-orange-100 shadow-sm">
        <p className="text-sm md:text-base font-medium">
          Built with ❤️ using MERN Stack — Keep learning, keep growing 🚀
        </p>
      </footer>
    </>
  );
}

export default PagesLayout;
