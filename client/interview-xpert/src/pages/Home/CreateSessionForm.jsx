import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

export const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    focusTopics: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, focusTopics, description } = formData;

    if (!role || !experience || !focusTopics) {
      setError("Please fill in the required fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        focusTopics,
        description,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">
          {"Start a New Interview Journey"}
        </h3>
        <p className="text-xs text-slate-700 mt-[15px] mb-3">
          {
            "Fill out a few quick details and unlock your personalized set of interview questions!"
          }
        </p>

        <form onSubmit={handleCreateSession} className=" flex flex-col gap-3">
          <Input
            value={formData.role}
            onChange={(e) => {
              handleChange("role", e.target.value);
            }}
            label={"Target role"}
            placeholder="(e.g. Frontend developer,UI/UX designer etc)"
            type={"text"}
          />
          <Input
            value={formData.experience}
            onChange={(e) => {
              handleChange("experience", e.target.value);
            }}
            label={"Years of Experience"}
            placeholder="(e.g. 2 years)"
            type={"number"}
          />
          <Input
            value={formData.focusTopics}
            onChange={(e) => {
              handleChange("focusTopics", e.target.value);
            }}
            label={"Focus topics"}
            placeholder="Topics to focus (Comma-seperated e.g. React,Node.js etc)"
            type={"text"}
          />
          <Input
            value={formData.description}
            onChange={(e) => {
              handleChange("description", e.target.value);
            }}
            label={"Description"}
            placeholder="Short description of the role"
            type={"text"}
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={isLoading}
          >
            {isLoading && <SpinnerLoader />}
            {"Create Session"}
          </button>
        </form>
      </div>
    </>
  );
};
