import React from "react";
import { MessageType } from "@/types/types";

interface ChatMessageProps {
  message: MessageType;
}

/**
 * Clean message content by removing any HTML tags or formatting artifacts
 */
const cleanMessageContent = (content: string): string => {
  // First, remove any "Amalfi Coast Bot" references since we add it manually
  let cleaned = content.replace(/Amalfi Coast Bot$/, '').trim();
  
  // Remove any HTML tags that might be present
  cleaned = cleaned.replace(/<[^>]*>|<\/[^>]*>/g, '');
  
  // Remove any markdown-style links
  cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // Remove any URL references or button syntax
  cleaned = cleaned.replace(/\((?:button|pulsante):\s*«([^»]+)»\s*→\s*([^)]+)\)/g, '');
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
  
  // Remove text inside parentheses containing URLs
  cleaned = cleaned.replace(/\((?:[^)]*?https?:\/\/[^)]*?)\)/g, '');
  
  // Clean up any double spaces or excessive whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  return cleaned.trim();
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, links } = message;
  
  if (role === "user") {
    return (
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-userBg self-end mb-4 shadow-sm">
        <p className="text-sm sm:text-base">{content}</p>
      </div>
    );
  } else {
    // Process the content to ensure it's clean of any HTML or formatting artifacts
    const displayContent = cleanMessageContent(content);
    
    return (
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg p-4 bg-botBg self-start mb-4 shadow-sm">
        <p className="text-sm sm:text-base whitespace-pre-line">{displayContent}</p>
        <span className="text-xs text-textSecondary mt-2 opacity-70">Amalfi Coast Bot</span>
        
        {links && links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md border border-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
