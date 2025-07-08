import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuArrowLeft } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "../../components/InterviewPrep/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import AIResponsePreview from "../../components/InterviewPrep/AIResponsePreview";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const queryClient = useQueryClient();

  const { data: sessionData, isPending } = useQuery({
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

  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const [isLoading, setIsLoading] = useState(false);

  const generateConceptExplanation = async (id) => {
    try {
      setErrorMsg("");
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.Generate_Explanation,
        { id }
      );

      if (response.data) {
        setExplanation(response.data);
        queryClient.setQueryData(["explanation", id], response.data); // cache it
      }
    } catch (error) {
      setExplanation(null);
      console.error("Error generating concept explanation:", error);
      setErrorMsg("Failed to generate explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = (id) => {
    const cached = queryClient.getQueryData(["explanation", id]);

    if (cached) {
      setExplanation(cached);
      setOpenLeanMoreDrawer(true);
    } else {
      generateConceptExplanation(id);
    }
  };

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

  const generateMoreQuestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `${API_PATHS.QUESTION.GENERATE_MORE_QUESTIONS}${sessionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["session", sessionId]);
      setVisibleCount((prev) => prev + 3);
    },
    onError: (error) => {
      console.error("Error generating more questions:", error);
      toast.error("Error generating more questions. Please try again.");
    },
  });

  return (
    <DashboardLayout>
      {!isPending ? (
        <>
          {/* Role Info Card with Back Button */}
          <div className="max-w-3xl mx-auto px-4 pt-4">
            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-sm text-orange-600 font-semibold mb-3 hover:underline cursor-pointer"
              >
                <LuArrowLeft className="text-base" />
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

          {/* Questions Section */}
          <div className="max-w-7xl mx-auto mt-12 px-4 md:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Interview Q&A
            </h2>

            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {sessionData?.questions
                  ?.slice(0, visibleCount)
                  .map((data, index) => (
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
                        onLearnMore={() =>
                          handleLearnMore(data._id, data.question)
                        }
                        onTogglePin={() =>
                          toggleQuestionPinStatus(data._id || data.id)
                        }
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>

              {/* Load More Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    const currentLength = sessionData?.questions?.length || 0;
                    if (visibleCount < currentLength) {
                      setVisibleCount((prev) => prev + 10);
                    } else {
                      generateMoreQuestionsMutation.mutate();
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-7 rounded-lg shadow transition duration-200 disabled:opacity-50"
                  disabled={generateMoreQuestionsMutation.isPending}
                >
                  {generateMoreQuestionsMutation.isPending ? (
                    <>
                      <SpinnerLoader />
                      {"Loading..."}
                    </>
                  ) : (
                    "Load More Questions"
                  )}
                </button>
              </div>
            </div>

            {/* Learn More Drawer */}
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <SpinnerLoader />
          <p className="text-gray-600 font-medium text-sm">
            Loading session...
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InterviewPrep;
