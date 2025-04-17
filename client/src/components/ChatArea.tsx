import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "@/context/ChatContext";

const ChatArea = () => {
  const { messages, isLoading } = useChatContext();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main
      ref={chatAreaRef}
      className="flex-1 overflow-y-auto p-4 chat-area"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cfcfcf #f1f1f1'
      }}
    >
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>
    </main>
  );
};

export default ChatArea;
