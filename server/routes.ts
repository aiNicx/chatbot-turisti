import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendMessageToLLM } from "./services/openRouterService";
import { readFileSync } from "fs";
import path from "path";

// Global chat state - in a real app, this would be per user and stored in a database
let chatHistory: Array<{ role: string; content: string }> = [];
let instructions: string;
let sourceSites: string[];

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

      // Add user message to history
      chatHistory.push({ role: "user", content: message });

      // Send to LLM and get response
      const result = await sendMessageToLLM(chatHistory, sourceSites);

      if (result) {
        // Add assistant message to history
        chatHistory.push({ role: "assistant", content: result.content });
        
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
      
      return res.status(200).json({ message: "Chat reset successfully" });
    } catch (error) {
      console.error("Error in reset endpoint:", error);
      return res.status(500).json({ message: "Failed to reset chat" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
