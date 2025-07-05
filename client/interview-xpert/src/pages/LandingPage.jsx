import React, { useState, useContext } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import { ProfileInfoCard } from "../components/Cards/ProfileInfoCard";
import { API_PATHS } from "../utils/apiPaths";

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
      <div className="w-full min-h-full bg-[#FFFCEF] relative">
        {/* Decorative blur background */}
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0 z-0" />

        {/* Header */}
        <div className="container mx-auto px-6 md:px-12 pt-6 relative z-10">
          <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-gradient-to-r from-[#fff9f0] to-white rounded-md w-full">
            <div className="text-2xl font-semibold text-gray-900 tracking-wide">
              Interview<span className="text-orange-500">Xpert</span>
            </div>

            {/* {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white text-sm font-medium px-6 py-2 rounded-full shadow hover:bg-black hover:text-white transition-colors"
                onClick={() => setOpenAuthModal(true)}
              >
                Continue with Google
              </button>
            )} */}
          </header>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-12 pt-16 pb-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left Side */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-4">
                <LuSparkles />
                AI Powered
              </div>
              <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
                Ace interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI-Powered{" "}
                </span>
                Learning
              </h1>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery – your ultimate interview toolkit is
                here.
              </p>
              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-full bg-[#FFFCEF] relative z-10">
        <div className="container mx-auto px-6 md:px-12 pt-10 pb-20">
          <section>
            <h2 className="text-2xl font-medium text-center mb-12">
              Features that make you shine
            </h2>

            <div className="flex flex-col items-center gap-8">
              {/* First 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFE8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Remaining Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFE8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-50 to-yellow-50 text-gray-700 text-center py-6 mt-16 border-t border-orange-100 shadow-sm">
        <p className="text-sm md:text-base font-medium">
          Built with ❤️ using MERN Stack — Keep learning, keep growing 🚀
        </p>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};
