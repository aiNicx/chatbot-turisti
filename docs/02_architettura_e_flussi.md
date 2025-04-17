# Architettura e Flussi di Esecuzione

## Struttura del Progetto

```
├── client/                  # Frontend React
│   ├── src/
│   │   ├── api/             # Client API per comunicare con il backend
│   │   ├── components/      # Componenti React
│   │   ├── context/         # Context API per stato globale
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility e configurazioni
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Componente principale
│   │   └── main.tsx         # Entry point React
│   └── index.html           # HTML template
├── server/                  # Backend Express
│   ├── services/            # Servizi (OpenRouter, WebSearch)
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # Definizione delle rotte API
│   ├── storage.ts           # Storage interface
│   ├── instructions.txt     # Istruzioni per il modello AI
│   └── source_sites.txt     # Siti sorgente per ricerca web
└── shared/                  # Shared code
    └── schema.ts            # Schema database condiviso
```

## Flussi di Esecuzione Principali

### 1. Flusso Inizializzazione Applicazione

```
1. client/src/main.tsx         # Entry point
2. client/src/App.tsx          # Rendering componente principale
3. ChatContextProvider         # Inizializzazione del context
4. ChatApp                     # Contenitore principale dell'UI
```

### 2. Flusso Invio Messaggio Utente

```
1. ChatInput.tsx               # L'utente digita e invia un messaggio
2. ChatContext.sendMessage     # Il messaggio viene processato nel context
3. chatApi.sendChatMessage     # API client invia la richiesta al backend
4. server/routes.ts            # Backend riceve la richiesta POST /api/chat
5. routes.updateConversationContext # Aggiornamento contesto conversazione
6. openRouterService.sendMessageToLLM # Invio a OpenRouter
7. OpenRouter API              # Elaborazione AI esterna
8. openRouterService.sanitizeText # Pulizia risposta da HTML/markdown
9. webSearchService.extractLinksFromText # Estrazione link contestuali
10. routes.ts (risposta)       # Risposta al frontend
11. ChatContext (aggiornamento)# Aggiornamento stato con nuova risposta
12. ChatArea.tsx               # Rendering del nuovo messaggio
13. ChatMessage.tsx            # Visualizzazione messaggio con eventuali link
```

### 3. Flusso Reset Chat

```
1. ChatHeader.tsx              # Click sul pulsante di reset
2. ResetConfirmationModal.tsx  # Conferma dell'utente
3. ChatContext.resetChatSession # Reset dello stato nel context
4. chatApi.resetChat           # Invio richiesta reset al backend
5. server/routes.ts            # Backend resetta la storia della chat
6. ChatContext                 # Aggiornamento UI con messaggio di benvenuto
```

## Gestione del Contesto di Conversazione

Il sistema mantiene un contesto di conversazione attraverso l'oggetto `conversationContext` in `server/routes.ts`:

```typescript
interface ConversationContext {
  topicsDiscussed: Set<string>;        // Argomenti già discussi
  linksProvided: Map<string, number>;  // Link già forniti e quante volte
  lastMessageHadLinks: boolean;        // Indica se l'ultimo messaggio aveva link
  messageCount: number;                // Conteggio dei messaggi nella conversazione
}
```

Questo contesto viene:
1. Aggiornato ad ogni messaggio dell'utente
2. Passato al servizio OpenRouter per generazione delle risposte
3. Utilizzato per estrarre link pertinenti e non ripetitivi
4. Ripristinato quando l'utente resetta la chat

## Integrazione con OpenRouter API

La comunicazione con l'API OpenRouter avviene in `server/services/openRouterService.ts`:

1. Il backend invia la cronologia dei messaggi all'API
2. La risposta viene sanitizzata per rimuovere HTML e markdown
3. Il testo viene processato per identificare riferimenti a siti o servizi
4. I link vengono aggiunti in base al contesto della conversazione

## Rilevamento Lingua e Adattamento UI

Il sistema implementa:

1. Rilevamento automatico della lingua in `webSearchService.detectLanguage()`
2. Adattamento del testo dei pulsanti in base alla lingua rilevata
3. Testi specifici per compagnie (es. traghetti) nelle varie lingue

## Workflow e Deployment

L'applicazione utilizza un workflow configurato ('Start application') che esegue `npm run dev` per avviare sia il server Express che il frontend Vite in modalità sviluppo.