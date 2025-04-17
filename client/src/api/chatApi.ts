import { apiRequest } from "@/lib/queryClient";
import { MessageResponse } from "@/types/types";

export const sendChatMessage = async (message: string): Promise<MessageResponse> => {
  const res = await apiRequest("POST", "/api/chat", { message });
  return res.json();
};

export const resetChat = async (): Promise<void> => {
  await apiRequest("POST", "/api/chat/reset", {});
};
