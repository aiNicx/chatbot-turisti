import React, { useState, FormEvent, RefObject } from "react";
import { useChatContext } from "@/context/ChatContext";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, inputRef }) => {
  const [inputValue, setInputValue] = useState("");
  const { isLoading } = useChatContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="px-4 py-3 border-t border-borderColor bg-white">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-2 border border-borderColor rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          placeholder="Scrivi un messaggio..."
          aria-label="Message input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isLoading || !inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Send message"
          disabled={isLoading || !inputValue.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
