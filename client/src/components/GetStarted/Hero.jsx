import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="h-20">
        <div className="fixed left-0 top-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-blue-100 bg-white/80 backdrop-blur-md transition-all">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20L20 4M4 4h6v6"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Xaviers Writter
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>

          {/* CTA + Mobile Menu Icon */}
          <div>
            {/* Desktop Only Button */}
            <Link to="/login" className="hidden sm:block">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full">
                Get Started
              </button>
            </Link>

            {/* Mobile Hamburger */}
            <svg
              onClick={() => setMenuOpen(true)}
              xmlns="http://www.w3.org/2000/svg"
              className="sm:hidden text-gray-700"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden fixed inset-0 ${
            menuOpen ? "w-full" : "w-0"
          } overflow-hidden bg-white text-gray-800 z-[200] transition-all`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 text-xl font-semibold">
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Contact</a>

            <Link to="/login">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full">
                Get Started
              </button>
            </Link>

            <svg
              onClick={() => setMenuOpen(false)}
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute top-6 right-6"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,#dbeafe_0%,#bfdbfe_40%,#ffffff_70%)]"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-400/20 blur-[120px] rounded-full top-20 -z-10"></div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl text-gray-900">
          Transform Your{" "}
          <span className="relative bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Writing
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradient_arc.svg"
              className="absolute -bottom-3 left-0 w-full opacity-80"
              alt=""
            />
          </span>{" "}
          Into Impactful Digital Experiences
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-xl text-gray-600 text-lg">
          Xaviers Writter empowers creators and brands to craft clear,
          compelling, and powerful content effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition text-white shadow-xl shadow-blue-200">
            Start Writing
          </button>

          <button className="px-8 py-3 rounded-full border border-blue-200 hover:border-blue-400 transition text-gray-700 hover:text-blue-600">
            Explore Features
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-gray-600 text-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">10K+</h2>
            Writers
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">50K+</h2>
            Articles
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">99%</h2>
            Satisfaction
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">24/7</h2>
            Support
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;