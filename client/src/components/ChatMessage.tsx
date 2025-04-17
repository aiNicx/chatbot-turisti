import React from "react";
import { MessageType } from "@/types/types";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, links } = message;
  
  if (role === "user") {
    return (
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-userBg self-end mb-4 shadow-sm">
        <p className="text-sm sm:text-base">{content}</p>
      </div>
    );
  } else {
    // Extract and remove any HTML tags or spans with "Amalfi Coast Bot"
    let displayContent = content;
    const botSignatureRegex = /Amalfi Coast Bot$|<span[^>]*>Amalfi Coast Bot<\/span>$/;
    displayContent = displayContent.replace(botSignatureRegex, '').trim();
    
    // Remove any embedded HTML styling for the bot signature
    const htmlSpanRegex = /<span\s+style="[^"]*">\s*Amalfi\s+Coast\s+Bot\s*<\/span>/g;
    displayContent = displayContent.replace(htmlSpanRegex, '').trim();
    
    // Also remove any text in parentheses that seems to be describing buttons
    const buttonTextRegex = /\((?:button|pulsante): «([^»]+)» → ([^)]+)\)/g;
    displayContent = displayContent.replace(buttonTextRegex, '').trim();
    
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
