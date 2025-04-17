import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center max-w-[85%] sm:max-w-[75%] rounded-lg p-4 bg-botBg self-start mb-4 shadow-sm">
      <div className="flex flex-col items-start">
        <div className="flex space-x-2 mb-2">
          <div className="w-2.5 h-2.5 bg-primary bg-opacity-70 rounded-full animate-pulse" 
            style={{ animationDuration: "1s" }}>
          </div>
          <div 
            className="w-2.5 h-2.5 bg-primary bg-opacity-70 rounded-full animate-pulse" 
            style={{ animationDuration: "1s", animationDelay: "0.2s" }}
          ></div>
          <div 
            className="w-2.5 h-2.5 bg-primary bg-opacity-70 rounded-full animate-pulse" 
            style={{ animationDuration: "1s", animationDelay: "0.4s" }}
          ></div>
        </div>
        <span className="text-xs text-textSecondary opacity-70">Amalfi Coast Bot sta scrivendo...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
