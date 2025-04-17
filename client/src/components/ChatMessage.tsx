import React from "react";
import { MessageType } from "@/types/types";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, links } = message;
  
  if (role === "user") {
    return (
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-userBg self-end mb-2">
        <p className="text-sm sm:text-base">{content}</p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-botBg self-start mb-2">
        <p className="text-sm sm:text-base whitespace-pre-line">{content}</p>
        <span className="text-xs text-textSecondary mt-1">Amalfi Coast Bot</span>
        
        {links && links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-3 py-2 text-xs font-medium text-white bg-primary rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {link.text}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default ChatMessage;
