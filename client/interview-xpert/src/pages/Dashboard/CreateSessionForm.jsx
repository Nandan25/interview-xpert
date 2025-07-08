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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-800">
        Start a New Interview Journey
      </h2>
      <p className="text-sm text-gray-600 mt-2 mb-5">
        Fill out a few quick details to unlock your personalized interview
        questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        <Input
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          label="Target Role"
          placeholder="e.g. Frontend Developer, UI/UX Designer"
          type="text"
          disabled={isLoading}
        />
        <Input
          value={formData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          label="Years of Experience"
          placeholder="e.g. 2 years"
          type="number"
          disabled={isLoading}
        />
        <Input
          value={formData.focusTopics}
          onChange={(e) => handleChange("focusTopics", e.target.value)}
          label="Focus Topics"
          placeholder="Comma-separated e.g. React, Node.js"
          type="text"
          disabled={isLoading}
        />
        <Input
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          label="Description"
          placeholder="Short description of the role"
          type="text"
          disabled={isLoading}
        />

        {error && <p className="text-sm text-red-500 -mt-1">{error}</p>}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-all duration-150"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <SpinnerLoader />
              {" Loading..."}
            </>
          ) : (
            "Create Session"
          )}
        </button>
      </form>
    </div>
  );
};
