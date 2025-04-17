import axios from "axios";
import { extractLinksFromText } from "./webSearchService";

interface LinkType {
  text: string;
  url: string;
}

interface LLMResponse {
  content: string;
  links?: LinkType[];
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
      const assistantMessage = response.data.choices[0].message.content;
      
      // Extract possible links from the text
      const links = extractLinksFromText(assistantMessage, sourceSites);
      
      return {
        content: assistantMessage,
        links
      };
    }

    return null;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
