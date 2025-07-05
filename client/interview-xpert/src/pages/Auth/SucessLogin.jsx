import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const SuccessLogin = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("access_token");

      if (!token) {
        return navigate("/login");
      }
      try {
        sessionStorage.setItem("token", token);
        const res = await axiosInstance.get(
          `${API_PATHS.PROFILE.GetUserProfile}`
        );
        updateUser({ token: token, ...res.data });
        console.log(res);
        navigate("/dashboard");
      } catch (error) {
        console.log("Error fetching user", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold text-gray-700">Logging you in...</p>
    </div>
  );
};

export default SuccessLogin;
