// web/src/app/login/page.tsx
"use client"; // Marks this file as a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext
import MessageModal from "../components/MessageModal"; // For user messages

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "success"
  );
  const [showRegisterForm, setShowRegisterForm] = useState(false); // State to toggle between login and register forms

  // Destructure registerUser from useAuth hook
  const { currentUser, loading, signIn, registerUser } = useAuth();
  const router = useRouter();

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/dashboard"); // Redirect to /dashboard
    }
  }, [currentUser, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessageModal("Please enter both email and password.", "error");
      return;
    }

    try {
      await signIn(email, password);
      showMessageModal(
        "Login successful! Redirecting to dashboard...",
        "success"
      );
      // The actual redirection happens in the useEffect
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          default:
            errorMessage = `Login error: ${error.message}`;
        }
      }
      showMessageModal(errorMessage, "error");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessageModal(
        "Please enter both email and password for registration.",
        "error"
      );
      return;
    }

    try {
      await registerUser(email, password); // Use the registerUser function from AuthContext
      showMessageModal("Registration successful! Please log in.", "success");
      setShowRegisterForm(false); // Switch back to login form after successful registration
      setEmail(""); // Clear form
      setPassword(""); // Clear form
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage =
              "The email address is already in use by another account.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters.";
            break;
          default:
            errorMessage = `Registration error: ${error.message}`;
        }
      }
      showMessageModal(errorMessage, "error");
    }
  };

  const showMessageModal = (
    message: string,
    type: "success" | "error" | "confirm"
  ) => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading || currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-beaverBlue-dark text-center mb-6">
          {showRegisterForm
            ? "Register for BeaverOS Admin"
            : "Login to BeaverOS Admin"}
        </h2>
        <form onSubmit={showRegisterForm ? handleRegister : handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Changed bg-beaverBlue-light to bg-beaverBlue-very_light
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Changed bg-beaverBlue-light to bg-beaverBlue-very_light
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors transform hover:scale-105"
          >
            {showRegisterForm ? "Register" : "Log In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          {showRegisterForm ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setShowRegisterForm(false)}
                className="text-beaverBlue hover:text-beaverBlue-dark font-medium focus:outline-none"
              >
                Log In
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setShowRegisterForm(true)}
                className="text-beaverBlue hover:text-beaverBlue-dark font-medium focus:outline-none"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
      />
    </div>
  );
}
