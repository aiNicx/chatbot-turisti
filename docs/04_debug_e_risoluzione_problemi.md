# Guida al Debug e Risoluzione dei Problemi

## Problemi Comuni e Soluzioni

### 1. Problemi con OpenRouter API

#### Sintomi
- Messaggi di errore nel server: "Error calling OpenRouter API"
- Nessuna risposta dal bot
- Timeout delle richieste

#### Soluzioni
- Verificare che la chiave API `OPENROUTER_API_KEY` sia presente nelle variabili d'ambiente
- Controllare i log per errori specifici dell'API
- Verificare la quota e i limiti dell'account OpenRouter

#### File Rilevanti
- `server/services/openRouterService.ts` (chiamata API)
- `server/routes.ts` (gestione errori)

### 2. HTML non Sanitizzato nelle Risposte

#### Sintomi
- Tag HTML visibili nel testo delle risposte (es. `<a>`, `<div>`)
- Formattazione markdown non renderizzata (es. `**testo**`)
- URL grezzi visibili nel testo

#### Soluzioni
- Espandere le regole di sanitizzazione in `openRouterService.sanitizeText()`
- Migliorare la pulizia del testo anche lato frontend in `ChatMessage.cleanMessageContent()`
- Aggiungere ulteriori pattern regex per catturare formati di testo problematici

#### File Rilevanti
- `server/services/openRouterService.ts` (sanitizzazione principale)
- `client/src/components/ChatMessage.tsx` (sanitizzazione secondaria)
- `server/instructions.txt` (istruzioni al modello LLM)

### 3. Problemi di Generazione Link Contestuali

#### Sintomi
- Link ripetuti in messaggi successivi
- Link non pertinenti al contesto della conversazione
- Assenza di link quando sarebbero rilevanti

#### Soluzioni
- Verificare la logica in `webSearchService.extractLinksFromText()`
- Controllare l'aggiornamento del contesto in `routes.updateConversationContext()`
- Migliorare i pattern di rilevamento degli argomenti

#### File Rilevanti
- `server/services/webSearchService.ts` (logica di estrazione link)
- `server/routes.ts` (gestione contesto)

### 4. Problemi di Rilevamento Lingua

#### Sintomi
- Pulsanti in lingua errata rispetto al messaggio dell'utente
- Rilevamento incoerente della lingua

#### Soluzioni
- Migliorare i pattern di rilevamento in `webSearchService.detectLanguage()`
- Aggiungere più indicatori linguistici per migliorare la precisione

#### File Rilevanti
- `server/services/webSearchService.ts` (funzione detectLanguage)

### 5. Problemi di UI/UX Mobile

#### Sintomi
- Elementi UI non allineati su dispositivi mobili
- Problemi di visualizzazione su schermi piccoli
- Comportamento incoerente dello scroll

#### Soluzioni
- Verificare i breakpoint responsive in tutte le classi Tailwind
- Testare su diversi dispositivi e dimensioni dello schermo
- Migliorare le media query e le classi specifiche per dispositivi mobili

#### File Rilevanti
- `client/src/components/ChatApp.tsx` (layout principale)
- `client/src/components/ChatMessage.tsx` (layout messaggi)
- `client/src/components/ChatInput.tsx` (input e invio)
- `client/src/context/ChatContext.tsx` (stile globale)

## Procedure di Debug

### Debug Backend

1. **Verificare i Log del Server**
   ```bash
   # I log più importanti sono visibili in:
   - Log del workflow 'Start application'
   - Console di errore del server
   ```

2. **Ispezionare il Contesto della Conversazione**
   ```typescript
   // In server/routes.ts, aggiungere:
   console.log(`Topics discussed: ${Array.from(conversationContext.topicsDiscussed).join(', ')}`);
   console.log(`Links provided: ${Array.from(conversationContext.linksProvided.entries())
     .map(([k, v]) => `${k}(${v})`).join(', ')}`);
   ```

3. **Verificare le Chiamate API OpenRouter**
   ```typescript
   // In server/services/openRouterService.ts, aggiungere:
   console.log("OpenRouter request:", {
     model: modelId,
     messages: chatHistory
   });
   ```

### Debug Frontend

1. **Ispezionare lo Stato dei Messaggi**
   ```typescript
   // In client/src/context/ChatContext.tsx, aggiungere:
   useEffect(() => {
     console.log("Current messages:", messages);
   }, [messages]);
   ```

2. **Verificare la Sanitizzazione del Testo**
   ```typescript
   // In client/src/components/ChatMessage.tsx, aggiungere:
   console.log("Raw content:", content);
   console.log("Cleaned content:", cleanMessageContent(content));
   ```

3. **Testare Componenti Specifici**
   Isolare componenti problematici per il debug:
   ```typescript
   // Esempio per isolare ChatMessage:
   const testMessage = {
     role: "assistant",
     content: "Contenuto problematico con <span>HTML</span> o [markdown](link)",
     links: [
       { text: "Test link", url: "https://example.com" }
     ]
   };
   return <ChatMessage message={testMessage} />;
   ```

## Miglioramento Continuo

### Aree di Miglioramento
1. **Rilevamento Lingua**: implementare una libreria più robusta per il rilevamento linguistico
2. **Sanitizzazione Testo**: continuare a migliorare i pattern regex per casi edge
3. **Contesto Conversazione**: espandere il tipo di argomenti tracciati
4. **Responsive Design**: ottimizzare ulteriormente per diversi dispositivi
5. **Istruzioni LLM**: raffinare le istruzioni per migliorare la qualità delle risposte