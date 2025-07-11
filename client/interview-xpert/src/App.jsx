import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import { UserProvider } from "./context/userContext";
import SuccessLogin from "./pages/Auth/SucessLogin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/interview-prep/:sessionId"
                element={<InterviewPrep />}
              />
              <Route path="/success-login" element={<SuccessLogin />} />
            </Routes>
          </Router>

          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
