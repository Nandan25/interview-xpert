import React, { useState, useContext } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import PagesLayout from "../components/layouts/PagesLayout";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleGoogleLogin = () => {
    try {
      const googleLoginUrl = `${API_PATHS.PROFILE.LOGIN}`;
      window.location.href = googleLoginUrl;
    } catch (error) {
      console.error("error login with google", error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      {/* Main wrapper with blur and background */}
      <PagesLayout>
        <div className="w-full min-h-screen bg-[#FFFCEF] relative">
          {/* Decorative blur background */}
          <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0 z-0" />

          {/* Hero Section */}
          <section className="container mx-auto px-6 md:px-12 py-20 flex flex-col justify-center min-h-screen relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left Side */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-2 text-base text-amber-600 font-semibold bg-amber-100 px-4 py-2 rounded-full border border-amber-300 mb-5 w-fit">
                  <LuSparkles />
                  AI Powered
                </div>
                <h1 className="text-6xl leading-tight font-semibold text-black mb-6">
                  Ace interviews with <br />
                  <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-bold">
                    AI-Powered
                  </span>{" "}
                  Learning
                </h1>
              </div>

              {/* Right Side */}
              <div className="w-full md:w-1/2">
                <p className="text-lg leading-relaxed text-gray-800 mb-8">
                  Get role-specific questions, expand answers when you need
                  them, dive deeper into concepts, and organize everything your
                  way. From preparation to mastery – your ultimate interview
                  toolkit is here.
                </p>
                <button
                  className="bg-black text-base font-semibold text-white px-8 py-3 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Features Section */}
        <div className="w-full bg-[#FFFCEF] relative z-10">
          <div className="container mx-auto px-6 md:px-12 pt-12 pb-20">
            <section>
              <h2 className="text-3xl font-semibold text-center mb-14">
                Features that make you shine
              </h2>

              <div className="flex flex-col items-center gap-10">
                {/* First 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFFE8] p-6 rounded-xl shadow hover:shadow-lg transition border border-amber-100"
                    >
                      <h3 className="text-lg font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Remaining Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFFE8] p-6 rounded-xl shadow hover:shadow-lg transition border border-amber-100"
                    >
                      <h3 className="text-lg font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </PagesLayout>
    </>
  );
};
