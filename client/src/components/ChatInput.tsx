import React, { useState, FormEvent, RefObject, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, inputRef }) => {
  const [inputValue, setInputValue] = useState("");
  const { isLoading } = useChatContext();
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="sticky bottom-0 px-4 py-4 border-t border-borderColor bg-white shadow-lg">
      <form onSubmit={handleSubmit} className="flex space-x-3 items-center max-w-4xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-3 border border-borderColor rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base shadow-sm"
          placeholder="Scrivi un messaggio..."
          aria-label="Message input"
          disabled={isLoading}
          style={{ 
            paddingBottom: isMobile ? '12px' : '12px',
            paddingTop: isMobile ? '12px' : '12px',
            fontSize: isMobile ? '16px' : '14px'
          }}
        />
        <button
          type="submit"
          className={`flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-md ${
            isLoading || !inputValue.trim() ? "opacity-70 cursor-not-allowed" : ""
          }`}
          aria-label="Send message"
          disabled={isLoading || !inputValue.trim()}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6"
            style={{ transform: "rotate(45deg)" }}
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
