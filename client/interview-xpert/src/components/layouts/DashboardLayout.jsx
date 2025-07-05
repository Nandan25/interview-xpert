import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../../context/userContext";

function DashboardLayout({ children }) {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />

      {user && <div>{children}</div>}
    </>
  );
}

export default DashboardLayout;
