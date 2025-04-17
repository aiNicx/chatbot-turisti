import axios from "axios";
import { extractLinksFromText, detectLanguage } from "./webSearchService";

interface LinkType {
  text: string;
  url: string;
}

interface LLMResponse {
  content: string;
  links?: LinkType[];
}

/**
 * Sanitizes text to remove unwanted HTML, code snippets, and formatting artifacts
 */
function sanitizeText(text: string): string {
  // Remove any HTML tags
  let cleanedText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
  
  // Remove any markdown-style or HTML links that might not be properly formatted
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // Remove any instances of HTML href elements
  cleanedText = cleanedText.replace(/<a href=["|']([^"']+)["|']>([^<]+)<\/a>/g, '$2');
  
  // Remove any parentheses with URLs inside
  cleanedText = cleanedText.replace(/\(https?:\/\/[^\s)]+\)/g, '');
  
  // Remove any "Amalfi Coast Bot" tag that might be formatted with markdown or HTML
  cleanedText = cleanedText.replace(/<small>.*?Amalfi Coast Bot.*?<\/small>/g, '');
  cleanedText = cleanedText.replace(/<span[^>]*>.*?Amalfi Coast Bot.*?<\/span>/g, '');
  
  // Remove any button descriptions with URL syntax
  cleanedText = cleanedText.replace(/\((?:button|pulsante):\s*«([^»]+)»\s*→\s*([^)]+)\)/g, '');
  
  // Remove text inside parentheses that contains URL
  cleanedText = cleanedText.replace(/\((?:[^)]*?https?:\/\/[^)]*?)\)/g, '');
  
  // Clean up any artifacts from costieraamalfitana.com mentions
  cleanedText = cleanedText.replace(/costieraamalfitana\.com\]\(https:\/\/www\.costieraamalfitana\.com\)/g, '');
  
  // Remove any direct URLs
  cleanedText = cleanedText.replace(/https?:\/\/[^\s]+/g, '');
  
  // Clean up multiple spaces and line breaks
  cleanedText = cleanedText.replace(/\s+/g, ' ');
  
  // Add "Amalfi Coast Bot" signature at the end (this will be handled by the UI)
  if (!cleanedText.endsWith('Amalfi Coast Bot')) {
    cleanedText = cleanedText.trim() + '\n\nAmalfi Coast Bot';
  }
  
  return cleanedText.trim();
}

export async function sendMessageToLLM(
  chatHistory: Array<{ role: string; content: string }>,
  sourceSites: string[]
): Promise<LLMResponse | null> {
  try {
    // Get API key and model from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    const modelId = process.env.OPENROUTER_MODEL_ID || "meta-llama/llama-4-maverick:free";

    if (!apiKey) {
      throw new Error("OpenRouter API key is missing");
    }

    // Make the request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: modelId,
        messages: chatHistory
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const rawMessage = response.data.choices[0].message.content;
      
      // Thoroughly sanitize the text to remove any unwanted HTML or formatting
      const sanitizedMessage = sanitizeText(rawMessage);
      
      // Extract possible links from the text
      const links = extractLinksFromText(sanitizedMessage, sourceSites);
      
      return {
        content: sanitizedMessage,
        links
      };
    }

    return null;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
