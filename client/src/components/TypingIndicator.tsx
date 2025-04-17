import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-botBg self-start mb-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce"></div>
        <div 
          className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" 
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div 
          className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" 
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
