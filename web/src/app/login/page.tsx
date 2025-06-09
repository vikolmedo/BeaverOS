// web/src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import MessageModal from "../components/MessageModal"; // Import the MessageModal
import Link from "next/link"; // Import Link for navigation

export default function LoginPage() {
  // CORRECTED: Destructure signInUser and registerUser
  const { currentUser, loading, signInUser, registerUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "success"
  );

  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [currentUser, loading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMessage(""); // Clear previous messages

    if (loading) return; // Prevent actions if auth is still loading

    try {
      if (isRegistering) {
        await registerUser(email, password); // Use registerUser
        showMessageModal(
          "Registration successful! You are now logged in.",
          "success"
        );
      } else {
        await signInUser(email, password); // Use signInUser
        showMessageModal("Login successful!", "success");
      }
      // Redirection handled by useEffect if currentUser is updated
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address format.";
            break;
          case "auth/user-disabled":
            errorMessage = "Your account has been disabled.";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password": // For signIn
          case "auth/invalid-credential": // More generic for both
            errorMessage = "Invalid email or password.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use. Try logging in.";
            break;
          case "auth/weak-password":
            errorMessage =
              "Password is too weak. It should be at least 6 characters.";
            break;
          case "auth/operation-not-allowed":
            errorMessage =
              "Email/password authentication is not enabled. Contact support.";
            break;
          default:
            errorMessage = `Authentication failed: ${error.message}`;
            break;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        <p className="text-beaverNeutral">Loading authentication status...</p>
      </div>
    );
  }

  // If currentUser exists, useEffect will redirect, so no need to render login page
  if (currentUser && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-beaverBlue-dark mb-6">
          {isRegistering ? "Register for BeaverOS" : "Login to BeaverOS"}
        </h2>
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md border border-beaverBlue-light focus:outline-none focus:ring-2 focus:ring-beaverBlue bg-beaverBlue-very_light text-gray-900"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md border border-beaverBlue-light focus:outline-none focus:ring-2 focus:ring-beaverBlue bg-beaverBlue-very_light text-gray-900"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-beaverBlue hover:underline text-sm"
          >
            {isRegistering
              ? "Already have an account? Login here."
              : "Don't have an account? Register here."}
          </button>
        </div>

        {/* Optional: Go to Demo Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Or, if you just want to try the POS demo:
            <Link href="/demo" className="text-beaverBlue hover:underline ml-1">
              Go to Demo
            </Link>
          </p>
        </div>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
        // No confirm action for login/register modals
      />
    </div>
  );
}
