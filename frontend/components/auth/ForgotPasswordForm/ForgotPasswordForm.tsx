"use client";
import { useUserContext } from "@/context/userContext";
import React, { useState } from "react";


function ForgotPasswordForm() {
 
    const [email, setEmail] = useState("")
    const { forgotPasswordEmail } = useUserContext();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const forgotPassword = async (e: any) => {
        e.preventDefault();
        await forgotPasswordEmail(email);
        setEmail("")
    }

    

  return (
   <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: '25%', left: '15%', animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ top: '65%', left: '10%', animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ top: '35%', right: '20%', animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: '75%', right: '15%', animationDelay: '0.5s', animationDuration: '3.2s' }} />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-gradient-radial from-cyan-400/10 to-transparent animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full bg-gradient-radial from-pink-500/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Forgot Password Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <form className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo/Brand */}
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
              Reset Password
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-8">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                name="email"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm pl-12"
                placeholder="johndoe@gmail.com"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            onClick={forgotPassword}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 relative overflow-hidden group mb-6"
          >
            <span className="relative z-10">Send Reset Link</span>
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

          {/* Info Card */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-300 mb-1">
                  What happens next?
                </h3>
                <p className="text-xs text-blue-200/80">
                  We'll send you an email with a secure link to reset your password. The link will expire in 1 hour for security.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-3">
              Having trouble? Contact support
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/contact"
                className="text-xs text-cyan-400 hover:text-pink-400 transition-colors duration-300 hover:underline"
              >
                Contact Support
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="/help"
                className="text-xs text-cyan-400 hover:text-pink-400 transition-colors duration-300 hover:underline"
              >
                Help Center
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;