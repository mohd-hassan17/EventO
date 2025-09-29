'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useUserContext } from "@/context/userContext"
import { Menu } from "@headlessui/react"
import { Button } from '../ui/button'
import BookingModal from './Booking'

const EventFlowHomepage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const { userLoginStatus, user, logout } = useUserContext()

  useEffect(() => {
    const checkStatus = async () => {
      const loggedIn = await userLoginStatus()
      setIsLoggedIn(loggedIn)
    }
    checkStatus()
  }, [userLoginStatus])

  // const handleBookClick = async () => {
  //   const isLoggedIn = await userLoginStatus()
  //   if (isLoggedIn) {
  //     router.push("/booking")
  //   } else {
  //     router.push("/register")
  //   }
  // }

   const handleBookClick = async () => {
    const isLoggedIn = await userLoginStatus()
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    // if logged in, open modal
    document.dispatchEvent(new CustomEvent("open-booking-modal"))
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMobileMenuOpen(false)
  }

  const submitNewsletter = () => {
    const emailInput = document.getElementById('newsletterEmail') as HTMLInputElement
    if (emailInput?.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(emailInput.value)) {
        const confetti = document.getElementById('newsletterConfetti')
        if (confetti) {
          confetti.style.opacity = '1'
          confetti.classList.add('animate-bounce')
          setTimeout(() => {
            confetti.style.opacity = '0'
            confetti.classList.remove('animate-bounce')
          }, 3000)
        }
        emailInput.value = ''
        alert('🎉 Successfully subscribed! Get ready for amazing events!')
      } else {
        alert('Please enter a valid email address')
      }
    }
  }

  const navigationItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Exhibition', id: 'exhibition' },
    { name: 'Venues', id: 'venues' },
    { name: 'Contact', id: 'contact' }
  ]

  return (
    <>
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float-particles {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.7; 
          }
        }

        @keyframes text-glow {
          from { 
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3); 
          }
          to { 
            text-shadow: 0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.3); 
          }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0px); 
          }
        }

        .animate-float-particles {
          animation: float-particles 8s infinite linear;
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s infinite ease-in-out;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite alternate;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s infinite ease-in-out;
        }

        .animate-bounce-gentle-delay-1 {
          animation: bounce-gentle 2s infinite ease-in-out;
          animation-delay: 0.2s;
        }

        .animate-bounce-gentle-delay-2 {
          animation: bounce-gentle 2s infinite ease-in-out;
          animation-delay: 0.4s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .shimmer-effect:hover::before {
          left: 100%;
        }

        /* Particle positions */
        .particle-1 { 
          background: #ec4899; 
          left: 15%; 
          animation-delay: -1s; 
          width: 6px;
          height: 6px;
        }
        
        .particle-2 { 
          background: #06b6d4; 
          left: 35%; 
          animation-delay: -2.5s; 
          width: 8px;
          height: 8px;
        }
        
        .particle-3 { 
          background: #8b5cf6; 
          left: 55%; 
          animation-delay: -4s; 
          width: 5px;
          height: 5px;
        }
        
        .particle-4 { 
          background: #f59e0b; 
          left: 75%; 
          animation-delay: -5.5s; 
          width: 7px;
          height: 7px;
        }
        
        .particle-5 { 
          background: #10b981; 
          left: 85%; 
          animation-delay: -7s; 
          width: 6px;
          height: 6px;
        }

        .glow-orb-1 {
          animation-delay: 0s;
        }

        .glow-orb-2 {
          animation-delay: 2s;
        }

        /* Responsive text shadows */
        @media (max-width: 768px) {
          .animate-text-glow {
            text-shadow: 0 0 15px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.2);
          }
        }

        /* Prevent layout shift */
        .prevent-layout-shift {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>

      <div className="bg-gray-900 text-white overflow-x-hidden min-h-screen relative">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
        ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl  ' 
            : 'bg-gray-900/90 backdrop-blur-lg'
        }
        `}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                EventO
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-white hover:text-cyan-400 transition-all duration-300 hover:-translate-y-0.5 font-medium relative group py-2"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ))}
                
                {/* User Menu / Register Button */}
                <div className="relative">
                  {isLoggedIn && user ? (
                    <Menu as="div" className="relative">
                      <Menu.Button className="focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full">
                        <img
                          src={user.photo || "/api/placeholder/40/40"}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 hover:border-pink-500 transition-colors duration-300"
                        />
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 mt-3 w-56 bg-gray-800/95 backdrop-blur-xl border border-white/20 divide-y divide-white/10 rounded-xl shadow-2xl focus:outline-none">
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-300 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                                  active ? "bg-red-500/10 text-red-300" : "text-red-400"
                                }`}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Menu>
                  ) : (
                    <Link href="/register">
                      <button className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 shimmer-effect">
                        Register
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-white/10">
                <div className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-white hover:text-cyan-400 transition-colors duration-300 py-2 font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                  {!isLoggedIn && (
                    <Link href="/register" className="pt-2">
                      <button className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-6 py-2 rounded-full font-semibold">
                        Register
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen relative flex items-center justify-center text-center overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating Particles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
              key={i}
              className={`absolute rounded-full animate-float-particles particle-${i}`}
              />
            ))}
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-gradient-radial from-cyan-400/15 via-cyan-400/5 to-transparent animate-pulse-glow glow-orb-1 blur-xl" />
            <div className="absolute bottom-1/4 right-1/6 w-64 h-64 rounded-full bg-gradient-radial from-pink-500/15 via-pink-500/5 to-transparent animate-pulse-glow glow-orb-2 blur-xl" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl px-4 animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-white via-cyan-400 to-pink-500 bg-clip-text text-transparent animate-text-glow leading-tight">
              Plan. Book. Celebrate.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed text-gray-200">
              Discover amazing events, connect with like-minded people, and create unforgettable memories. Your next adventure starts here.
            </p>
              <BookingModal>
                      
            <Button
              onClick={handleBookClick}
             className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white px-10 py-5 sm:px-12 sm:py-7 rounded-full text-lg sm:text-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-500 shimmer-effect animate-gradient-shift">
              Book Your Event
            </Button>
              
            </BookingModal>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            About EventO
          </h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                EventO is your premier destination for discovering and booking extraordinary events. From intimate concerts to grand exhibitions, we connect you with experiences that matter.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Founded in 2024, we've helped thousands of people discover their passion through carefully curated events that bring communities together.
              </p>
              <div className="grid grid-cols-3 gap-8 pt-8">
                {[
                  { number: '50K+', label: 'Events Hosted', color: 'text-cyan-400' },
                  { number: '2M+', label: 'Happy Customers', color: 'text-pink-500' },
                  { number: '100+', label: 'Cities', color: 'text-purple-400' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl sm:text-3xl font-black mb-6 text-center">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg text-center">
                To make unforgettable experiences accessible to everyone by connecting event organizers with passionate attendees through our innovative platform.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Event Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { emoji: '🎵', title: 'Concerts', bg: 'from-purple-500 to-pink-500' },
              { emoji: '🎨', title: 'Art Shows', bg: 'from-cyan-500 to-blue-500' },
              { emoji: '🍷', title: 'Wine Tasting', bg: 'from-red-500 to-orange-500' },
              { emoji: '🎭', title: 'Theater', bg: 'from-green-500 to-teal-500' },
              { emoji: '📚', title: 'Workshops', bg: 'from-indigo-500 to-purple-500' },
              { emoji: '🎪', title: 'Festivals', bg: 'from-pink-500 to-rose-500' },
              { emoji: '🏃', title: 'Sports', bg: 'from-yellow-500 to-orange-500' },
              { emoji: '🍕', title: 'Food Events', bg: 'from-emerald-500 to-cyan-500' }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`aspect-square rounded-2xl bg-gradient-to-br ${item.bg} p-6 sm:p-8 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>
                <div className="text-white font-bold text-center text-sm sm:text-base lg:text-lg">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exhibition Section */}
        <section id="exhibition" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Featured Exhibitions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '🎵 Summer Music Festival',
                date: 'June 15-17, 2025',
                location: 'Central Park, Mumbai',
                price: '₹2,500'
              },
              {
                title: '🎨 Contemporary Art Expo',
                date: 'June 20-22, 2025',
                location: 'Bandra Gallery District',
                price: '₹800'
              },
              {
                title: '🍽️ Culinary Masters Show',
                date: 'June 25-26, 2025',
                location: 'Taj Hotel, Colaba',
                price: '₹3,200'
              }
            ].map((event, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl p-8 border border-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-6 group-hover:text-cyan-400 transition-colors duration-300">
                  {event.title}
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 flex items-center text-base sm:text-lg">
                    <span className="mr-3">📅</span>
                    {event.date}
                  </p>
                  <p className="text-gray-300 flex items-center text-base sm:text-lg">
                    <span className="mr-3">📍</span>
                    {event.location}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-cyan-400 pt-2">
                    {event.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: '🔍', 
                title: 'Browse', 
                desc: 'Explore thousands of exciting events happening in your area and beyond',
                animation: 'animate-bounce-gentle'
              },
              { 
                icon: '🎟️', 
                title: 'Book', 
                desc: 'Secure your spot with our simple and secure booking process',
                animation: 'animate-bounce-gentle-delay-1'
              },
              { 
                icon: '🎉', 
                title: 'Celebrate', 
                desc: 'Show up and enjoy an unforgettable experience with fellow event-goers',
                animation: 'animate-bounce-gentle-delay-2'
              }
            ].map((step, index) => (
              <div key={index} className="text-center group hover:-translate-y-4 transition-all duration-300">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl ${step.animation} shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-400/25`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 group-hover:text-cyan-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Venues Section */}
        <section id="venues" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Popular Venues
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Royal Opera House', location: 'South Mumbai', capacity: '1,100' },
              { name: 'NCPA Theater', location: 'Nariman Point', capacity: '800' },
              { name: 'Phoenix Mills', location: 'Lower Parel', capacity: '2,000' },
              { name: 'Jio Garden', location: 'BKC', capacity: '5,000' }
            ].map((venue, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm group"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {venue.name}
                </h3>
                <p className="text-gray-400 mb-2 text-base sm:text-lg flex items-center">
                  <span className="mr-2">📍</span>
                  {venue.location}
                </p>
                <p className="text-cyan-400 font-bold text-base sm:text-lg flex items-center">
                  <span className="mr-2">👥</span>
                  {venue.capacity} capacity
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            What People Say
          </h2>
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
            <div className="text-center">
              <blockquote className="text-xl sm:text-2xl md:text-3xl mb-8 leading-relaxed text-gray-200 italic">
                "EventO made it so easy to find and book the perfect concert for my birthday. The whole experience was seamless and the event was absolutely amazing!"
              </blockquote>
              <cite className="text-cyan-400 font-bold text-lg sm:text-xl not-italic">
                - Priya Sharma, Mumbai
              </cite>
            </div>
          </div>
        </section>

        {/* Newsletter & Contact */}
        <section id="contact" className="py-20 sm:py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-800/60 to-purple-900/30 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Stay in the Loop</h2>
            <p className="text-gray-300 mb-12 text-lg sm:text-xl">Get notified about the hottest events and exclusive early-bird discounts</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
              <input
                type="email"
                id="newsletterEmail"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-base sm:text-lg"
              />
              <button
                onClick={submitNewsletter}
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-white rounded-full font-bold hover:scale-105 transition-transform duration-300 shimmer-effect text-base sm:text-lg"
              >
                Subscribe
              </button>
            </div>

            <div id="newsletterConfetti" className="text-4xl sm:text-5xl opacity-0 transition-opacity duration-500 mb-8">
              🎉✨🎊
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-8">Get in Touch</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-xl">📧</span>
                  <span>hello@EventO.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-xl">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-xl">📍</span>
                  <span>Mumbai, Maharashtra</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-xl">🕒</span>
                  <span>Mon-Fri 9AM-6PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/80 border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-8">
              EventO
            </div>
            
            <div className="flex justify-center space-x-6 mb-12">
              {[
                { emoji: '📘', label: 'Facebook' },
                { emoji: '📷', label: 'Instagram' },
                { emoji: '🐦', label: 'Twitter' },
                { emoji: '💼', label: 'LinkedIn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 text-xl sm:text-2xl"
                  aria-label={social.label}
                >
                  {social.emoji}
                </a>
              ))}
            </div>
            
            <p className="text-gray-400 text-base sm:text-lg">
              © 2025 EventO. All rights reserved. | Made with ❤️ in Mumbai
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default EventFlowHomepage