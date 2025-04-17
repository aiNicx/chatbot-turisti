import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ChatContextProvider } from "@/context/ChatContext";
import ChatApp from "@/components/ChatApp";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContextProvider>
        <Router />
        <Toaster />
      </ChatContextProvider>
    </QueryClientProvider>
  );
}

export default App;
