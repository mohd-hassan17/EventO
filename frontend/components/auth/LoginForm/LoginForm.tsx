'use client'

import { useUserContext } from "@/context/userContext";
import { useState } from "react";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, userState, handlerUserInput } = useUserContext();

  const { email, password } = userState;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: '20%', left: '10%', animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ top: '60%', left: '20%', animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ top: '40%', right: '15%', animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ top: '70%', right: '25%', animationDelay: '0.5s', animationDuration: '3.2s' }} />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-gradient-radial from-cyan-400/10 to-transparent animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full bg-gradient-radial from-pink-500/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <form className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
              EventFlow
            </h1>
            <h2 className="text-xl font-semibold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">
              Login to your account. Don't have one?{" "}
              <a
                href="/register"
                className="text-cyan-400 hover:text-pink-400 font-semibold transition-colors duration-300 hover:underline"
              >
                Register here
              </a>
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handlerUserInput("email")(e)}
                name="email"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="johndoe@gmail.com"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlerUserInput("password")(e)}
                name="password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm pr-12"
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 via-pink-400/5 to-pink-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <a
              href="/forgot-password"
              className="text-sm text-cyan-400 hover:text-pink-400 transition-colors duration-300 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={loginUser}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Login Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            {/* <span className="px-4 text-gray-400 text-sm">or continue with</span> */}
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>

          {/* Social Login Buttons */}
          {/* <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white hover:bg-gray-600/50 hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white hover:bg-gray-600/50 hover:border-pink-400/50 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div> */}

          {/* Additional Info */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-cyan-400 hover:underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;