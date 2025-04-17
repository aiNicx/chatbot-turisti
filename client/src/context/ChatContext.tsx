import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sendChatMessage, resetChat } from "@/api/chatApi";
import { MessageType } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface ChatContextProps {
  messages: MessageType[];
  isLoading: boolean;
  isResetModalOpen: boolean;
  sendMessage: (content: string) => void;
  resetChatSession: () => void;
  setIsResetModalOpen: (isOpen: boolean) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: "Benvenuto! Sono Amalfi Coast Bot, il tuo assistente turistico per la Costiera Amalfitana. Come posso aiutarti oggi?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { toast } = useToast();

  // Send a message to the bot and get a response
  const sendMessage = async (content: string) => {
    try {
      // Add user message to the chat
      const userMessage: MessageType = {
        role: "user",
        content
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Send message to backend
      const response = await sendChatMessage(content);
      
      if (response) {
        // Add bot response to chat
        setMessages(prev => [...prev, {
          role: "assistant",
          content: response.content,
          links: response.links
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio del messaggio. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the chat session
  const resetChatSession = async () => {
    try {
      setIsLoading(true);
      await resetChat();
      
      // Reset to initial welcome message
      setMessages([
        {
          role: "assistant",
          content: "Benvenuto! Sono Amalfi Coast Bot, il tuo assistente turistico per la Costiera Amalfitana. Come posso aiutarti oggi?"
        }
      ]);
    } catch (error) {
      console.error("Error resetting chat:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il reset della chat. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Configure global styles for Tailwind when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #1a73e8;
        --botBg: #f3f4f6;
        --userBg: #e8f0fe;
        --textMain: #333333;
        --textSecondary: #6b7280;
        --borderColor: #e5e7eb;
      }
      
      body {
        font-family: 'Open Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        height: 100vh;
        overflow: hidden;
      }
      
      .chat-area::-webkit-scrollbar {
        width: 6px;
      }
      
      .chat-area::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      
      .chat-area::-webkit-scrollbar-thumb {
        background: #cfcfcf;
        border-radius: 6px;
      }
      
      .chat-area::-webkit-scrollbar-thumb:hover {
        background: #b3b3b3;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const value = {
    messages,
    isLoading,
    isResetModalOpen,
    sendMessage,
    resetChatSession,
    setIsResetModalOpen
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
