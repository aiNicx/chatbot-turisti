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
        --primary: #1e88e5;
        --botBg: #f8f9fa;
        --userBg: #e3f2fd;
        --textMain: #2d3748;
        --textSecondary: #64748b;
        --borderColor: #e2e8f0;
      }
      
      body {
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        height: 100vh;
        overflow: hidden;
        background-color: #ffffff;
        color: var(--textMain);
      }
      
      /* Animazioni per nuovi messaggi */
      .flex-col > div {
        animation: slideIn 0.3s ease forwards;
        transform: translateY(10px);
        opacity: 0;
      }
      
      @keyframes slideIn {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      /* Personalizzazione scrollbar */
      .chat-area::-webkit-scrollbar {
        width: 6px;
      }
      
      .chat-area::-webkit-scrollbar-track {
        background: rgba(241, 241, 241, 0.5);
        border-radius: 6px;
      }
      
      .chat-area::-webkit-scrollbar-thumb {
        background: rgba(180, 180, 180, 0.5);
        border-radius: 6px;
        transition: background 0.2s ease;
      }
      
      .chat-area::-webkit-scrollbar-thumb:hover {
        background: rgba(150, 150, 150, 0.8);
      }
      
      /* Stile per pallini di caricamento */
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
      }
      
      .animate-pulse {
        animation: pulse 1.5s infinite ease-in-out;
      }
      
      /* Effetto hover per i bottoni */
      button, a {
        transition: all 0.2s ease;
      }
      
      button:hover, a:hover {
        transform: translateY(-1px);
      }
      
      button:active, a:active {
        transform: translateY(1px);
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
