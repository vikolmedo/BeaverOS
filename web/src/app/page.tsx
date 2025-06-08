// web/src/app/page.tsx
'use client'; // This component will be a client component for interactivity

import Link from 'next/link'; // Import Link for client-side navigation
import Image from 'next/image'; // Import Image for optimized images (if needed later)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beaverBlue-dark to-beaverBlue flex flex-col justify-between text-white font-sans antialiased">
      {/* Header */}
      <header className="p-6 md:p-8 flex justify-between items-center z-10">
        <div className="text-2xl font-bold">BeaverOS</div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="#features" className="hover:text-beaverBlue-light transition-colors">Features</Link></li>
            <li><Link href="#about" className="hover:text-beaverBlue-light transition-colors">About Us</Link></li>
            <li><Link href="#contact" className="hover:text-beaverBlue-light transition-colors">Contact</Link></li>
            <li><Link href="/login" className="bg-white text-beaverBlue-dark px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">Login</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center p-8 text-center overflow-hidden">
        {/* Background Overlay for effect */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Abstract Background Shapes/Graphics (using Tailwind classes for simplicity) */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-beaverBlue-light rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-beaverNeutral rounded-full opacity-10 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-beaverBlue-dark rounded-full opacity-10 blur-3xl animate-blob animation-delay-6000"></div>


        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in">
            BeaverOS: Build Your Business, Your Way.
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay-300">
            The open-source, modular POS and ERP solution designed for your growth.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in-delay-600">
            <Link href="https://github.com/vikolmedo/BeaverOS" target="_blank" rel="noopener noreferrer" className="bg-white text-beaverBlue-dark px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105">
              Explore on GitHub
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-beaverBlue-dark transition duration-300 shadow-lg transform hover:scale-105">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-beaverNeutral-light text-beaverNeutral-dark p-12 md:p-16 py-20 text-center">
        <h2 className="text-4xl font-bold mb-12 text-beaverBlue-dark">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Modular Design</h3>
            <p className="text-lg">Customize BeaverOS with modules tailored to your business needs. Add only what you require, expand when ready.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Comprehensive POS</h3>
            <p className="text-lg">Streamline sales with an intuitive Point-of-Sale interface, inventory tracking, and payment processing.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Integrated ERP</h3>
            <p className="text-lg">Manage resources, track financials, and optimize operations seamlessly across your entire enterprise.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Open Source Freedom</h3>
            <p className="text-lg">Leverage the power of a community-driven platform. Inspect, modify, and contribute to its evolution.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Scalable Architecture</h3>
            <p className="text-lg">Built to grow with your business, from a single store to a multi-location enterprise.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4">Developer Friendly</h3>
            <p className="text-lg">Clear APIs, extensive documentation, and a welcoming community for developers to build upon.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-beaverBlue-dark text-white p-12 md:p-16 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">About BeaverOS</h2>
        <p className="text-lg max-w-3xl mx-auto leading-relaxed">
          BeaverOS is a revolutionary open-source project aimed at providing businesses with a flexible, powerful, and
          affordable solution for Point-of-Sale and Enterprise Resource Planning. Our mission is to empower
          companies of all sizes to manage their operations efficiently and scale without limitations.
        </p>
        <p className="text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
          Driven by a passionate community, we believe in transparency, collaboration, and continuous improvement. Join us
          in building the future of business management software.
        </p>
        <div className="mt-12 flex justify-center space-x-6">
          <Link href="https://github.com/vikolmedo/BeaverOS/graphs/contributors" target="_blank" rel="noopener noreferrer" className="bg-white text-beaverBlue-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-md">
            Meet the Team
          </Link>
          <Link href="https://github.com/vikolmedo/BeaverOS/wiki" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-beaverBlue-dark transition duration-300 shadow-md">
            Read Our Wiki
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-beaverNeutral-light text-beaverNeutral-dark p-12 md:p-16 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8 text-beaverBlue-dark">Get in Touch</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Have questions or want to learn more about BeaverOS? Reach out to us!
        </p>
        <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
          <a href="mailto:contact@beaveros.com" className="bg-beaverBlue hover:bg-beaverBlue-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg transform hover:scale-105 w-full">
            Email Us
          </a>
          <a href="https://github.com/vikolmedo/BeaverOS/issues" target="_blank" rel="noopener noreferrer" className="border-2 border-beaverBlue hover:border-beaverBlue-dark text-beaverBlue hover:text-beaverBlue-dark font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg transform hover:scale-105 w-full">
            Open an Issue on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-beaverNeutral-dark text-white p-6 md:p-8 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; 2025 BeaverOS. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:text-beaverBlue-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-beaverBlue-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
