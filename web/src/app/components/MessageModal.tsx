// web/src/app/components/MessageModal.tsx
// This React component renders a modal to display success, error, or confirmation messages.
// It is reusable and can be customized with different types and actions.

import React from "react";

interface MessageModalProps {
  isOpen: boolean; // Controls modal visibility
  message: string; // The message to display
  type: "success" | "error" | "confirm"; // Message type for styling and behavior
  onClose: () => void; // Function to close the modal
  onConfirm?: () => void; // Confirmation action function (only for 'confirm' type)
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  message,
  type,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null; // Don't render if not open

  // Determine header and primary button styles based on message type
  let headerClass = "";
  let buttonClass = "";
  let buttonText = "OK";

  switch (type) {
    case "success":
      headerClass = "bg-success text-white";
      buttonClass = "bg-success hover:bg-green-700";
      break;
    case "error":
      headerClass = "bg-error text-white";
      buttonClass = "bg-error hover:bg-red-700";
      break;
    case "confirm":
      headerClass = "bg-beaverBlue-dark text-white"; // Use a blue for confirmation
      buttonClass = "bg-beaverBlue hover:bg-beaverBlue-dark";
      buttonText = "Confirm";
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all sm:my-8 sm:align-middle sm:w-full">
        {/* Modal Header */}
        <div className={`px-4 py-3 rounded-t-lg ${headerClass}`}>
          <h3 className="text-lg leading-6 font-bold">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="px-4 py-4 sm:p-6">
          <p className="text-sm text-gray-700 break-words">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          {type === "confirm" && (
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonClass}`}
              onClick={onConfirm}
            >
              {buttonText}
            </button>
          )}
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beaverNeutral sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            {type === "confirm" ? "Cancel" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
