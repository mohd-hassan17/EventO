'use client'
import React, { useState } from "react";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";

type Props = {
  params: Promise<{
    verificationToken: string;
  }>;
};

const Page = ({ params }: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { resetPassword } = useUserContext();
  const { verificationToken } = React.use(params);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    resetPassword(verificationToken, password);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: "25%", left: "15%", animationDelay: "0s", animationDuration: "3s" }} />
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ top: "65%", left: "10%", animationDelay: "1s", animationDuration: "4s" }} />
        <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ top: "35%", right: "20%", animationDelay: "2s", animationDuration: "3.5s" }} />
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: "75%", right: "15%", animationDelay: "0.5s", animationDuration: "3.2s" }} />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-gradient-radial from-cyan-400/10 to-transparent animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full bg-gradient-radial from-pink-500/10 to-transparent animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Reset Password Form */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
              EventFlow
            </h1>
            <h2 className="text-xl font-semibold text-white mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Enter your new password below to secure your account
            </p>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm pl-12"
                placeholder="********"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2 1.5-3.5 3.5-3.5S19 9 19 11c0 2-1.5 3.5-3.5 3.5S12 13 12 11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <i className="fas fa-eye-slash" /> : <i className="fas fa-eye" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm pl-12"
                placeholder="********"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2 1.5-3.5 3.5-3.5S19 9 19 11c0 2-1.5 3.5-3.5 3.5S12 13 12 11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 relative overflow-hidden group mb-6"
          >
            <span className="relative z-10">Reset Password</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <a
              href="/login"
              className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
