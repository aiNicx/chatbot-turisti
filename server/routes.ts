import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendMessageToLLM } from "./services/openRouterService";
import { getLinksForMessage, updateLinkUsageStats } from "./services/linkService";
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";

// Interfaccia per tenere traccia del contesto della conversazione
interface ConversationContext {
  topicsDiscussed: Set<string>;        // Argomenti già discussi
  linksProvided: Map<string, number>;  // Link già forniti e quante volte
  lastMessageHadLinks: boolean;        // Indica se l'ultimo messaggio aveva link
  messageCount: number;                // Conteggio dei messaggi nella conversazione corrente
}

// Global chat state - in a real app, this would be per user and stored in a database
let chatHistory: Array<{ role: string; content: string }> = [];
let instructions: string;
let sourceSites: string[];

// Inizializza il contesto della conversazione
const conversationContext: ConversationContext = {
  topicsDiscussed: new Set<string>(),
  linksProvided: new Map<string, number>(),
  lastMessageHadLinks: false,
  messageCount: 0
};

try {
  // Load instructions and source sites from files
  instructions = readFileSync(path.join(import.meta.dirname, "instructions.txt"), "utf-8");
  const sourceSitesContent = readFileSync(path.join(import.meta.dirname, "source_sites.txt"), "utf-8");
  sourceSites = sourceSitesContent.split("\n").filter(line => line.trim() !== "");
} catch (error) {
  console.error("Error loading instructions or source sites:", error);
  instructions = "You are Amalfi Coast Bot, an assistant for the Amalfi Coast region.";
  sourceSites = ["traghettiamalfi.it", "museibeniamalfi.com", "visitcostiera.it"];
}

// Funzione per aggiornare il contesto della conversazione
function updateConversationContext(message: string, links?: { text: string, url: string }[]) {
  // Incrementa il conteggio dei messaggi
  conversationContext.messageCount++;
  
  // Rileva i temi principali del messaggio
  const lowerMsg = message.toLowerCase();
  
  // Traccia gli argomenti discussi
  if (lowerMsg.includes('traghett') || lowerMsg.includes('ferry') || lowerMsg.includes('boat') || 
      lowerMsg.includes('ferr') || lowerMsg.includes('nave')) {
    conversationContext.topicsDiscussed.add('ferry');
  }
  
  if (lowerMsg.includes('attività') || lowerMsg.includes('activities') || 
      lowerMsg.includes('what to do') || lowerMsg.includes('cosa fare') || 
      lowerMsg.includes('visit') || lowerMsg.includes('vedere')) {
    conversationContext.topicsDiscussed.add('activities');
  }
  
  if (lowerMsg.includes('spiaggia') || lowerMsg.includes('beach') || 
      lowerMsg.includes('mare') || lowerMsg.includes('sea')) {
    conversationContext.topicsDiscussed.add('beach');
  }
  
  // Traccia i link forniti in questo messaggio
  if (links && links.length > 0) {
    conversationContext.lastMessageHadLinks = true;
    
    links.forEach(link => {
      const domain = new URL(link.url).hostname.replace('www.', '');
      const currentCount = conversationContext.linksProvided.get(domain) || 0;
      conversationContext.linksProvided.set(domain, currentCount + 1);
    });
  } else {
    conversationContext.lastMessageHadLinks = false;
  }
}

// Funzione di utilità per rilevare la località richiesta nel messaggio utente
function rilevaLocalitaAttivita(messaggio: string): string | null {
  const localita = [
    "amalfi", "atrani", "cetara", "maiori", "minori", "paestum", "pompei", "positano", "ravello", "sorrento", "vietri"
    // aggiungi altre località se crei altri file
  ];
  const msg = messaggio.toLowerCase();
  for (const loc of localita) {
    if (msg.includes(loc)) return loc;
  }
  return null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the system message
  chatHistory = [
    { role: "system", content: instructions }
  ];

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid message format" });
      }
      
      // Aggiorna il contesto con il messaggio dell'utente
      updateConversationContext(message);

      // Rileva se l'utente chiede attività per una località specifica
      const localita = rilevaLocalitaAttivita(message);
      let attivitaContent = "";
      if (localita) {
        const attivitaPath = path.join(import.meta.dirname, "attivita", `${localita}.txt`);
        if (existsSync(attivitaPath)) {
          attivitaContent = readFileSync(attivitaPath, "utf-8");
        }
      }

      // Prepara la chat history da inviare al modello
      const chatHistoryToSend = [...chatHistory];
      if (attivitaContent) {
        // Inserisci le attività come nuovo messaggio di sistema subito dopo le istruzioni
        chatHistoryToSend.splice(1, 0, { role: "system", content: attivitaContent });
      }

      // Add user message to history
      chatHistoryToSend.push({ role: "user", content: message });

      // Check for predefined links first
      const predefinedLinks = getLinksForMessage(message, req.body.lang);
      
      let result;
      if (predefinedLinks) {
        result = {
          content: predefinedLinks.text,
          links: predefinedLinks.links
        };
      } else {
        // Fallback to LLM if no predefined links match
        result = await sendMessageToLLM(chatHistoryToSend, sourceSites, conversationContext);
      }

      if (result) {
        // Add assistant message to history
        chatHistory.push({ role: "assistant", content: result.content });
        
        // Aggiorna il contesto con la risposta e i link
        updateConversationContext(result.content, result.links);
        if (result.links) {
          result.links.forEach(link => updateLinkUsageStats(link.url));
        }
        
        console.log(`Topics discussed: ${Array.from(conversationContext.topicsDiscussed).join(', ')}`);
        console.log(`Links provided: ${Array.from(conversationContext.linksProvided.entries()).map(([k, v]) => `${k}(${v})`).join(', ')}`);
        
        // Return the response
        return res.status(200).json({
          content: result.content,
          links: result.links
        });
      } else {
        throw new Error("Failed to get response from LLM");
      }
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Reset chat endpoint
  app.post("/api/chat/reset", (_req, res) => {
    try {
      // Reset chat history to just the system message
      chatHistory = [
        { role: "system", content: instructions }
      ];
      
      // Reset conversation context
      conversationContext.topicsDiscussed.clear();
      conversationContext.linksProvided.clear();
      conversationContext.lastMessageHadLinks = false;
      conversationContext.messageCount = 0;
      
      return res.status(200).json({ message: "Chat reset successfully" });
    } catch (error) {
      console.error("Error in reset endpoint:", error);
      return res.status(500).json({ message: "Failed to reset chat" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
