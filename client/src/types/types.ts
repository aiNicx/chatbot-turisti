export interface LinkType {
  text: string;
  url: string;
}

export interface MessageType {
  role: "user" | "assistant";
  content: string;
  links?: LinkType[];
}

export interface MessageResponse {
  content: string;
  links?: LinkType[];
}

export interface ChatSessionRequest {
  message: string;
}

export interface ChatSessionResponse {
  content: string;
  links?: LinkType[];
}
