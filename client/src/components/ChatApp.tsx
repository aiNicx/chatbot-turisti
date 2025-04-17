import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import ResetConfirmationModal from "./ResetConfirmationModal";
import { useChatContext } from "@/context/ChatContext";

const ChatApp = () => {
  const { sendMessage, resetChatSession, isResetModalOpen, setIsResetModalOpen } = useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input field on initial load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleResetChat = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetChatSession();
    setIsResetModalOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCancelReset = () => {
    setIsResetModalOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitMessage = (message: string) => {
    if (message.trim() === "") return;
    sendMessage(message);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-textMain">
      <ChatHeader onResetChat={handleResetChat} />
      <ChatArea />
      <ChatInput onSubmit={handleSubmitMessage} inputRef={inputRef} />
      
      {isResetModalOpen && (
        <ResetConfirmationModal 
          onCancel={handleCancelReset} 
          onConfirm={handleConfirmReset} 
        />
      )}
    </div>
  );
};

export default ChatApp;
