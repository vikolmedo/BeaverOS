// web/src/app/page.tsx
"use client"; // This component uses client-side features like useState, useEffect, etc.

import Link from "next/link"; // Import Link for client-side navigation
import React from "react"; // Import React as it's a React component

export default function Home() {
  return (
    <div className="min-h-screen bg-beaverNeutral-light font-sans text-beaverNeutral-dark">
      {/* Header Section */}
      <header className="py-6 px-4 md:px-8 bg-white shadow-md rounded-b-lg">
        <nav className="container mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-beaverBlue-dark hover:text-beaverBlue transition-colors"
          >
            BeaverOS
          </Link>
          <div className="space-x-4">
            <a
              href="#features"
              className="text-beaverNeutral-dark hover:text-beaverBlue transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-beaverNeutral-dark hover:text-beaverBlue transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-beaverNeutral-dark hover:text-beaverBlue transition-colors"
            >
              Contact
            </a>
            {/* Link to the Admin Dashboard (now at /dashboard) */}
            <Link
              href="/dashboard"
              className="bg-beaverBlue text-white px-4 py-2 rounded-lg font-semibold hover:bg-beaverBlue-dark transition-colors shadow-md"
            >
              Admin Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-beaverBlue py-20 md:py-32 text-center text-white overflow-hidden rounded-lg shadow-xl mx-auto mt-8 max-w-6xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            BeaverOS: Build Your Business, Your Way.
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            The open-source, modular Point-of-Sale (POS) and Enterprise Resource
            Planning (ERP) solution designed for growth.
          </p>
          <div className="space-x-4">
            <a
              href="https://github.com/vikolmedo/BeaverOS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-beaverBlue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105 inline-block"
            >
              Explore on GitHub
            </a>
            {/* "Try Demo" button now points to the new /dashboard route */}
            <Link
              href="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-beaverBlue transition duration-300 shadow-lg transform hover:scale-105 inline-block"
            >
              Try Admin Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-beaverNeutral-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-beaverBlue-dark mb-10">
            Powerful Features for Growing Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">
                Modular POS
              </h3>
              <p className="text-beaverNeutral">
                Streamlined sales, customizable interface, fast transactions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">
                Comprehensive ERP
              </h3>
              <p className="text-beaverNeutral">
                Manage inventory, accounting, and customer relations
                efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">
                Open Source & Flexible
              </h3>
              <p className="text-beaverNeutral">
                Adaptable to your unique needs, built by a vibrant community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-beaverBlue-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">About BeaverOS</h2>
          <p className="text-lg mb-4 max-w-3xl mx-auto">
            BeaverOS was founded on the principle that powerful business tools
            should be accessible and adaptable to everyone. We believe in
            empowering businesses of all sizes with cutting-edge, open-source
            technology.
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Our mission is to foster a community where developers and businesses
            collaborate to build the future of retail and enterprise management.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-beaverNeutral-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-beaverBlue-dark mb-10">
            Get in Touch
          </h2>
          <p className="text-lg mb-6 text-beaverNeutral">
            Have questions or want to contribute? Reach out to us!
          </p>
          <a
            href="mailto:contact@beaveros.com"
            className="bg-beaverBlue text-white px-8 py-3 rounded-lg font-semibold hover:bg-beaverBlue-dark transition duration-300 shadow-lg transform hover:scale-105 inline-block"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-beaverBlue-dark text-white py-8 text-center text-sm rounded-t-lg mt-8">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 BeaverOS. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a
              href="#"
              className="hover:text-beaverLightBlue transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-beaverLightBlue transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="https://github.com/vikolmedo/BeaverOS/blob/main/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-beaverLightBlue transition-colors"
            >
              Code of Conduct
            </a>
            <a
              href="https://github.com/vikolmedo/BeaverOS/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-beaverLightBlue transition-colors"
            >
              Contribute
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
