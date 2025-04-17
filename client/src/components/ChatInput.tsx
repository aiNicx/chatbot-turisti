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
          className={`flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shadow-lg border border-blue-700 ${
            isLoading || !inputValue.trim() ? "opacity-70 cursor-not-allowed" : ""
          }`}
          aria-label="Send message"
          disabled={isLoading || !inputValue.trim()}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-7 h-7"
            style={{ 
              filter: "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))"
            }}
          >
            <path d="M5.25 2.25a3 3 0 00-3 3v13.5a3 3 0 003 3h13.5a3 3 0 003-3V5.25a3 3 0 00-3-3H5.25zm9.78 13.97a.75.75 0 001.06 0l3.75-3.75a.75.75 0 000-1.06l-3.75-3.75a.75.75 0 00-1.06 1.06l2.47 2.47H5.25a.75.75 0 000 1.5h12.25l-2.47 2.47a.75.75 0 000 1.06z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
