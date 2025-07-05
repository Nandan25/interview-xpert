import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import axios from "axios";
import AIResponsePreview from "./components/AIResponsePreview";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SESSION.GET_ONE}${sessionId}`
      );
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Concept Explanation
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg(""); // Clear any previous error messages
      setIsLoading(true); // Set loading state to true
      setOpenLeanMoreDrawer(true); // Open the drawer

      const response = await axiosInstance.post(
        API_PATHS.AI.Generate_Explanation, // API endpoint for generating explanation
        {
          question, // Pass the question as payload
        }
      );
      console.log(response);

      // If response.data exists, set the explanation
      if (response.data && response.data.data) {
        setExplanation(response.data.data);
      }
    } catch (error) {
      // Handle error
      setExplanation(null);
      console.error("Error generating concept explanation:", error);
      setErrorMsg("Failed to generate explanation. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.QUESTION.PIN}${questionId}`
      );

      console.log(response);

      if (response.data && response.data.question) {
        toast.success(`Question pinned succesfully`);
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Add more questions to a session
  const uploadMoreQuestions = async () => {};

  useEffect(() => {
    fetchSessionDetailsById();
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />
      <div className="mx-auto mt-8 px-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interview Q & A
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sessionData &&
              sessionData.questions.map((data, index) => (
                <motion.div
                  key={data._id || data.id} // Use data.id if _id is not available
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    duration: 0.4,
                    delay: index * 0.1,
                    damping: 15,
                  }}
                  layoutId={`question-${data._id || data.id}`} // This is the key prop that animates position changes
                >
                  <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    onLearnMore={() =>
                      generateConceptExplanation(data.question)
                    }
                    isPinned={data?.isPinned}
                    onTogglePin={() =>
                      toggleQuestionPinStatus(data._id || data.id)
                    }
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium mt-1">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
