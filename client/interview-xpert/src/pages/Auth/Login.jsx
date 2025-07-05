import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
// import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  /*Handle login form submit */
  const handleLogin = async (e) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   setError("Please enter a valid email address.");
    //   return;
    // }
    // if (!password) {
    //   setError("Please enter the password");
    //   return;
    // }

    setError("");

    //Login api
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    try {
      const googleLoginUrl = `${API_BASE_URL}/auth/google`;
      window.location.href = googleLoginUrl;
    } catch (error) {
      console.error("error login with google", error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      {/* <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">{"Welcome back"}</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {"Please enter your details to log in"}
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            label="Email Address"
            placeholder="mike@toprogram.com"
            type="text"
          />
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            {"Login"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            {"Don't have an account? "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              {"Sign up"}
            </button>
          </p>
        </form>
      </div> */}
      <div className="spe-connector-multi">Connect to twitter</div>
      <div
        onClick={handleGoogleLogin}
        style={{ width: "100%" }}
        className={
          "cursor-pointer  bg-sky-400 p-3 rounded-lg  font-semibold text-left special-btn "
        }
      >
        <button className="text-white">
          <i className="fa-brands fa-twitter"></i> &nbsp;
          {"Connect to twitter"}
        </button>
      </div>
    </>
  );
}

export default Login;
