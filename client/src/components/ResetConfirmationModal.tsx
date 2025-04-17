import React, { useEffect, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";

interface ResetConfirmationModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({ 
  onCancel, 
  onConfirm 
}) => {
  const { setIsResetModalOpen } = useChatContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    // Focus confirm button for keyboard accessibility
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onCancel]);

  // Close if clicked outside modal
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onCancel();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl border border-gray-100 transform transition-all duration-200 scale-100">
        <div className="flex items-center mb-4">
          <div className="mr-3 p-2 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">Conferma Reset</h2>
        </div>
        <p className="mb-6 text-gray-700">Sei sicuro di voler ricominciare la conversazione? Tutti i messaggi della chat corrente verranno eliminati.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Annulla
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Conferma Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;
