# Supporto Multilingua e Funzionalità Principali

## Sistema di Supporto Multilingua

Il progetto implementa un sofisticato sistema di supporto multilingua che opera a diversi livelli:

### 1. Rilevamento della Lingua dell'Utente

File: `server/services/webSearchService.ts`

```typescript
export function detectLanguage(text: string): string {
  const textLower = text.toLowerCase();
  
  // Check for Italian indicators
  if (textLower.includes(' il ') || textLower.includes(' la ') || /* ... */) {
    return 'it';
  }
  
  // Check for German indicators
  if (textLower.includes(' der ') || textLower.includes(' die ') || /* ... */) {
    return 'de';
  }
  
  // Verifica altre lingue (francese, spagnolo, russo, cinese)
  // ...
  
  // Default to English
  return 'en';
}
```

Questa funzione analizza il testo ricevuto per identificare pattern tipici di varie lingue, supportando:
- Italiano (it)
- Inglese (en, default)
- Tedesco (de)
- Spagnolo (es)
- Francese (fr)
- Russo (ru)
- Cinese (zh)

### 2. Adattamento del Testo dei Pulsanti

I pulsanti vengono tradotti dinamicamente in base alla lingua rilevata:

File: `server/services/webSearchService.ts`

```typescript
function getCompanyButtonText(company: string, language: string): string {
  switch (language) {
    case 'it': return `Orari ${company}`;
    case 'en': return `${company} schedules`;
    case 'de': return `${company} Fahrpläne`;
    case 'es': return `Horarios ${company}`;
    case 'fr': return `Horaires ${company}`;
    case 'ru': return `Расписание ${company}`;
    case 'zh': return `${company}时刻表`;
    default: return `${company}`;
  }
}

function getActivityButtonText(language: string): string {
  switch (language) {
    case 'it': return 'Esplora attività';
    case 'en': return 'Explore activities';
    // Altri casi per le varie lingue
  }
}

function getGenericButtonText(language: string): string {
  switch (language) {
    case 'it': return 'Maggiori informazioni';
    case 'en': return 'More information';
    // Altri casi per le varie lingue
  }
}
```

### 3. Istruzioni al Modello AI per Risposta Multilingua

File: `server/instructions.txt`

Le istruzioni al modello AI specificano chiaramente di:
- Rilevare SEMPRE la lingua dell'utente
- Rispondere ESCLUSIVAMENTE nella stessa lingua
- Adattare lo stile di comunicazione in base alla lingua (più formale in tedesco, più colloquiale in italiano, ecc.)

## Gestione del Contesto della Conversazione

Il sistema implementa un sofisticato meccanismo di tracciamento del contesto della conversazione:

### File di Implementazione
- `server/routes.ts` (definizione e aggiornamento)
- `server/services/webSearchService.ts` (utilizzo per la generazione dei link)
- `server/services/openRouterService.ts` (integrazione con LLM)

### Struttura del Contesto

```typescript
interface ConversationContext {
  topicsDiscussed: Set<string>;        // Argomenti già discussi
  linksProvided: Map<string, number>;  // Link già forniti e quante volte
  lastMessageHadLinks: boolean;        // Indica se l'ultimo messaggio aveva link
  messageCount: number;                // Conteggio dei messaggi nella conversazione
}
```

### Funzionalità Principali

1. **Rilevamento degli Argomenti**: Il sistema identifica automaticamente quando si parla di:
   - Traghetti/barche (`ferry`)
   - Attività turistiche (`activities`)
   - Spiagge/mare (`beach`)

2. **Tracciamento dei Link**: Il sistema monitora quali link sono già stati forniti e quante volte

3. **Prevenzione delle Ripetizioni**: L'algoritmo evita di fornire link già inviati recentemente:
   ```typescript
   // Verifichiamo se esistono già link alle compagnie di traghetti
   const ferryLinksAlreadyProvided = conversationContext?.linksProvided?.has('travelmar.it') || 
                                   conversationContext?.linksProvided?.has('alicost.it');
   
   // Verifichiamo se esistono già link alle attività
   const activityLinksAlreadyProvided = conversationContext?.linksProvided?.has('costieraamalfitana.com');
   ```

4. **Link Contestuali**: I link vengono forniti basandosi sul contesto della conversazione:
   ```typescript
   // CASO 1: Fornire link ai traghetti solo se sono rilevanti nel contesto attuale
   if (containsTraghetti && !ferryLinksAlreadyProvided) {
     console.log("Fornisco link ai traghetti (non forniti in precedenza)");
     // ...
   }
   
   // CASO 2: Fornire link alle attività solo se sono rilevanti
   if (containsAttivita && !activityLinksAlreadyProvided) {
     console.log("Fornisco link alle attività (non fornito in precedenza)");
     // ...
   }
   ```

## Sistema di Sanitizzazione del Testo

Un componente cruciale del sistema è la sanitizzazione del testo per garantire che nessun elemento HTML o markdown non renderizzato appaia nelle risposte:

### File di Implementazione
- `server/services/openRouterService.ts` (backend)
- `client/src/components/ChatMessage.tsx` (frontend)

### Operazioni di Sanitizzazione (Backend)

```typescript
function sanitizeText(text: string): string {
  // Remove any HTML tags
  let cleanedText = text.replace(/<[^>]*>|<\/[^>]*>/g, '');
  
  // Remove any markdown-style or HTML links that might not be properly formatted
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // Remove any instances of HTML href elements
  cleanedText = cleanedText.replace(/<a href=["|']([^"']+)["|']>([^<]+)<\/a>/g, '$2');
  
  // Remove any parentheses with URLs inside, ma preserva le menzioni delle compagnie
  cleanedText = cleanedText.replace(/\(https?:\/\/[^\s)]+\)/g, '');
  
  // Altro codice di sanitizzazione...
  
  return cleanedText.trim();
}
```

### Operazioni di Sanitizzazione (Frontend)

```typescript
const cleanMessageContent = (content: string): string => {
  // First, remove any "Amalfi Coast Bot" references since we add it manually
  let cleaned = content.replace(/Amalfi Coast Bot$/, '').trim();
  
  // Remove any HTML tags that might be present
  cleaned = cleaned.replace(/<[^>]*>|<\/[^>]*>/g, '');
  
  // Altre operazioni di pulizia...
  
  return cleaned.trim();
};
```

## Animazioni e User Experience

L'applicazione implementa diverse animazioni e miglioramenti UX:

### File CSS (in ChatContext.tsx)

```css
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
```

Queste animazioni vengono applicate per:
1. Entrata fluida dei nuovi messaggi
2. Indicatore di digitazione durante il caricamento
3. Effetti hover sui pulsanti
4. Transizioni per vari elementi dell'interfaccia