# Spiegazione dei file chiave e loro ruolo nel modello

## server/instructions.txt
Questo file contiene tutte le istruzioni fondamentali che guidano il comportamento del bot "Amalfi Coast Bot". Definisce:
- Il tono, il contesto e le regole di formattazione delle risposte.
- Le informazioni principali su Marina d'Albori e la Costiera Amalfitana.
- Le regole su come rispondere in base alla lingua dell'utente.
- Le attività consigliate e le informazioni sulle località.
- Le regole su come gestire i link, la struttura delle risposte e i limiti del dominio di competenza.

**Influenza sul modello:**
Viene caricato come messaggio di sistema all'inizio di ogni conversazione e fornisce la "personalità" e i limiti operativi del bot. Ogni risposta del modello è fortemente influenzata da queste istruzioni.

**Quando e perché viene usato:**
Viene letto all'avvio del server e ogni volta che la chat viene resettata, per assicurare che il contesto sia sempre coerente.

---

## server/routes.ts
Questo file definisce le API principali del backend:
- Gestisce la ricezione dei messaggi dell'utente e l'invio delle risposte del bot.
- Tiene traccia dello stato della conversazione (argomenti discussi, link già forniti, ecc.).
- Carica le istruzioni e i siti di riferimento.
- Espone le rotte `/api/chat` (per inviare messaggi) e `/api/chat/reset` (per resettare la conversazione).

**Influenza sul modello:**
Prepara il contesto (chat history + istruzioni) che viene inviato al modello. Aggiorna il contesto della conversazione per evitare ripetizioni e per rispettare le regole definite in `instructions.txt`.

**Quando e perché viene usato:**
Ogni volta che l'utente invia un messaggio o resetta la chat. È il punto di ingresso tra frontend e modello.

---

## server/services/openRouterService.ts
Gestisce la comunicazione con il modello LLM tramite API esterne (OpenRouter):
- Invia la chat history e riceve la risposta dal modello.
- Pulisce e normalizza il testo della risposta (rimuove HTML, markdown, link diretti, ecc.).
- Estrae eventuali link rilevanti tramite funzioni dedicate.

**Influenza sul modello:**
Non influenza direttamente il comportamento del modello, ma filtra e adatta le risposte per rispettare le regole di formattazione e sicurezza definite in `instructions.txt`.

**Quando e perché viene usato:**
Ogni volta che serve una risposta dal modello. Garantisce che la risposta sia conforme alle regole del bot prima di inviarla al frontend.

---

## server/services/webSearchService.ts
Contiene funzioni di supporto per:
- Rilevare la lingua del messaggio.
- Estrarre link pertinenti dal testo, in base al contesto e ai siti di riferimento.
- Generare etichette per i pulsanti/link in base alla lingua e al tipo di informazione richiesta (traghetti, attività, ecc.).

**Influenza sul modello:**
Non modifica il comportamento del modello, ma arricchisce le risposte con link contestuali e coerenti con la conversazione, evitando duplicazioni e rispettando le regole di formattazione.

**Quando e perché viene usato:**
Dopo aver ricevuto la risposta dal modello, per arricchirla con link utili e contestuali, sempre nel rispetto delle regole definite.

---

## server/source_sites.txt
Elenco dei siti di riferimento autorizzati per fornire link agli utenti:
- Contiene solo i domini approvati (es. travelmar.it, alicost.it, costieraamalfitana.com).

**Influenza sul modello:**
Non influenza direttamente il modello, ma limita i link che possono essere suggeriti nelle risposte, garantendo affidabilità e coerenza.

**Quando e perché viene usato:**
Viene letto all'avvio del server e ogni volta che si devono generare link nelle risposte.

---

## client/src/context/ChatContext.tsx
Gestisce lo stato della chat lato frontend:
- Tiene traccia dei messaggi, dello stato di caricamento e del reset della chat.
- Si occupa di inviare i messaggi al backend e ricevere le risposte.
- Gestisce la visualizzazione dei messaggi e delle eventuali notifiche di errore.

**Influenza sul modello:**
Non influenza il modello, ma determina quando e come vengono inviati i messaggi e ricevute le risposte, assicurando che il flusso utente sia fluido e conforme alle regole UX/UI.

**Quando e perché viene usato:**
Ogni volta che l'utente interagisce con la chat dal frontend (invio messaggi, reset, caricamento, ecc.).

---

## Riepilogo generale
- **instructions.txt**: definisce le regole e la personalità del bot (influenza diretta sul modello).
- **routes.ts**: gestisce il flusso dei messaggi e il contesto della conversazione.
- **openRouterService.ts**: comunica con il modello e adatta le risposte.
- **webSearchService.ts**: arricchisce le risposte con link contestuali e rileva la lingua.
- **source_sites.txt**: limita i link ai soli siti approvati.
- **ChatContext.tsx**: gestisce la chat lato frontend, senza influenzare il modello. 