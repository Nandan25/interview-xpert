import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuArrowLeft } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import AIResponsePreview from "./components/AIResponsePreview";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const queryClient = useQueryClient();

  const { data: sessionData } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_PATHS.SESSION.GET_ONE}${sessionId}`
      );

      return response.data.session;
    },
    enabled: !!sessionId, // only fetch if sessionId exists
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const navigate = useNavigate();

  // const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.Generate_Explanation,
        {
          question,
        }
      );

      if (response.data?.data) {
        setExplanation(response.data.data);
        queryClient.setQueryData(["explanation", question], response.data.data); // cache it
      }
    } catch (error) {
      setExplanation(null);
      console.error("Error generating concept explanation:", error);
      setErrorMsg("Failed to generate explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = (question) => {
    const cached = queryClient.getQueryData(["explanation", question]);

    if (cached) {
      setExplanation(cached);
      setOpenLeanMoreDrawer(true);
    } else {
      generateConceptExplanation(question);
    }
  };

  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.QUESTION.PIN}${questionId}`
      );

      if (response.data?.question) {
        // toast.success("Question pinned successfully");

        // Update the cached session data manually
        queryClient.setQueryData(["session", sessionId], (oldData) => {
          if (!oldData) return;

          // Toggle the pin status for the question
          const updatedQuestions = oldData.questions.map((q) =>
            q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
          );

          // Move pinned questions to the top
          updatedQuestions.sort(
            (a, b) => (b.isPinned ? true : false) - (a.isPinned ? true : false)
          );

          return {
            ...oldData,
            questions: updatedQuestions,
          };
        });
      } else {
        toast.error("Failed to pin the question.");
      }
    } catch (error) {
      console.error("Error pinning question:", error);
      toast.error("Error occurred while pinning.");
    }
  };

  // Add more questions to a session
  const uploadMoreQuestions = async () => {};

  // useEffect(() => {
  //   fetchSessionDetailsById();
  // }, [sessionId]);

  return (
    <DashboardLayout>
      {/* Role Info Card with Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-orange-600 font-semibold mb-4 hover:underline"
          >
            <LuArrowLeft className="text-lg" />
            Back to Dashboard
          </button>

          <RoleInfoHeader
            role={sessionData?.role || ""}
            focusTopics={sessionData?.focusTopics || ""}
            experience={sessionData?.experience || "-"}
            questions={sessionData?.questions?.length || "-"}
            description={sessionData?.description || ""}
            lastUpdated={
              sessionData?.updatedAt
                ? moment(sessionData.updatedAt).format("Do MMM YYYY")
                : ""
            }
          />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Interview Q&A
        </h2>

        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {sessionData?.questions?.map((data, index) => (
              <motion.div
                key={data._id || data.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  duration: 0.5,
                  delay: index * 0.05,
                  damping: 18,
                }}
              >
                <QuestionCard
                  question={data?.question}
                  answer={data?.answer}
                  isPinned={data?.isPinned}
                  onLearnMore={() => handleLearnMore(data.question)}
                  onTogglePin={() =>
                    toggleQuestionPinStatus(data._id || data.id)
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Drawer for Learn More */}
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
    </DashboardLayout>
  );
};

export default InterviewPrep;
