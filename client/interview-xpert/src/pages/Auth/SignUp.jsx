import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
// import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
// import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

function SignUp({ setCurrentPage }) {
  // const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    // if (!validateEmail(email)) {
    //   setError("Please enter a valid email address");
    //   return;
    // }
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");

    //Signup api
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
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

  return (
    <>
      <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">
          {"Create an account"}
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {"Join us today by entering your details below"}
        </p>

        <form onSubmit={handleSignUp}>
          {/* <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} /> */}
          <div className="grid grid-ols-1  md:grid-cols-1 gap-2">
            <Input
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label="Email"
              placeholder="John@example.com"
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
              {"Sign up"}
            </button>

            <p className="text-[13px] text-slate-800 mt-3">
              {"Already have an account? "}
              <button
                className="font-medium text-primary underline cursor-pointer"
                onClick={() => {
                  setCurrentPage("login");
                }}
              >
                {"Login"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
