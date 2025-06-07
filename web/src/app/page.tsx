// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 border-b-4 border-blue-500">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold uppercase">BeaverOS</div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="#features" className="hover:text-blue-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-blue-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/vikolmedo/BeaverOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="hero" className="bg-blue-500 text-white py-24 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold mb-4">
              Revolutionize Your Business with BeaverOS
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The open-source, modular Point-of-Sale (POS) and Enterprise
              Resource Planning (ERP) solution designed for growth.
            </p>
            <div className="space-x-4">
              <a
                href="https://github.com/vikolmedo/BeaverOS"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                Explore on GitHub
              </a>
              <Link
                href="#features"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition duration-300"
              >
                Learn More
              </Link>
              <a
                href="/demo"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-beaverBlue-dark transition-colors"
              >
                Try Demo
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-10 text-gray-800">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-left">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Modular Architecture
                </h3>
                <p className="text-gray-700">
                  Independent microservices for unparalleled flexibility and
                  scalability.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-left">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Open Source Freedom
                </h3>
                <p className="text-gray-700">
                  Transparent, customizable, and community-driven. Own your
                  data, own your system.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-left">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Modern POS & ERP
                </h3>
                <p className="text-gray-700">
                  Streamline sales, inventory, accounting, and more with
                  intuitive tools.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md text-left">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Multi-Platform Clients
                </h3>
                <p className="text-gray-700">
                  Web, desktop, and mobile clients for seamless operation across
                  devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-gray-100 py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              About BeaverOS
            </h2>
            <p className="text-lg mb-4 text-gray-700">
              BeaverOS is an ambitious open-source project aimed at providing
              businesses of all sizes with a powerful, adaptable, and
              cost-effective POS and ERP solution. Built on modern technologies
              like FastAPI, React, and Qt, it emphasizes modularity,
              extensibility, and community collaboration.
            </p>
            <p className="text-lg mb-8 text-gray-700">
              Our goal is to create a vibrant ecosystem where businesses can
              easily adapt the software to their unique needs, and developers
              can contribute to a meaningful, impactful project.
            </p>
            <a
              href="docs/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Read Our Docs
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Get Involved
            </h2>
            <p className="text-lg mb-4 text-gray-700">
              BeaverOS is a community effort. Whether you&apos;re a developer, a
              business owner, a designer, or a technical writer, your
              contributions are welcome!
            </p>{" "}
            {/* Fixed apostrophe here */}
            <p className="text-lg mb-8 text-gray-700">
              Join our discussions, report bugs, suggest features, or contribute
              code on GitHub.
            </p>
            <a
              href="https://github.com/vikolmedo/BeaverOS/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Join the Community
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; 2025 BeaverOS. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a
              href="docs/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              Code of Conduct
            </a>
            <a
              href="docs/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              Contribute
            </a>
            <a
              href="docs/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              License
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
