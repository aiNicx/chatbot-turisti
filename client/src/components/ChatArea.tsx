import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "@/context/ChatContext";

const ChatArea = () => {
  const { messages, isLoading } = useChatContext();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <main
      ref={chatAreaRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 chat-area bg-gradient-to-b from-white to-gray-50"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cfcfcf #f1f1f1'
      }}
    >
      <div className="flex flex-col space-y-2 max-w-4xl mx-auto pb-2">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
        
        {/* Empty space at bottom to ensure proper scrolling on mobile */}
        <div className="h-2 md:h-4" />
      </div>
    </main>
  );
};

export default ChatArea;
