import React from "react";

interface ChatHeaderProps {
  onResetChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onResetChat }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-borderColor bg-white">
      <h1 className="text-lg font-medium font-openSans">marinadalbori</h1>
      <button 
        onClick={onResetChat}
        className="p-2 text-textSecondary rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
        aria-label="Reset chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </header>
  );
};

export default ChatHeader;
