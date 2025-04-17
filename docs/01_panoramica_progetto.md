# Panoramica del Progetto "Amalfi Coast Bot"

## Obiettivo del Progetto
Amalfi Coast Bot è un'applicazione web full-screen con interfaccia chat, progettata specificamente per fornire assistenza turistica sulla Costiera Amalfitana. L'applicazione è ottimizzata per dispositivi mobili ed è in grado di fornire informazioni accurate e contestuali sui trasporti, le attività, gli alloggi e gli eventi nella regione.

## Caratteristiche Principali
1. **Interfaccia Chat Reattiva**: Design full-screen ottimizzato per dispositivi mobili con interfaccia fluida.
2. **Supporto Multilingua**: Rilevamento automatico della lingua dell'utente e risposta nella stessa lingua.
3. **Integrazione AI**: Utilizzo dell'API OpenRouter per generare risposte intelligenti e contestuali.
4. **Web Search Integration**: Capacità di estrarre e suggerire link pertinenti da siti web affidabili.
5. **Contestualizzazione**: Memoria della conversazione per evitare ripetizioni e fornire risposte coerenti.
6. **UI/UX Migliorata**: Animazioni fluide, pulsanti contestuali, e formattazione del testo ottimizzata.

## Tecnologie Utilizzate

### Frontend
- **React**: Framework per l'interfaccia utente
- **TypeScript**: Linguaggio di programmazione tipizzato
- **Tailwind CSS**: Framework CSS per lo styling
- **shadcn/ui**: Componenti UI riutilizzabili
- **react-hook-form**: Gestione dei form
- **react-query**: Gestione delle chiamate API

### Backend
- **Node.js/Express**: Server web
- **OpenRouter API**: Integrazione con modelli AI (Llama 4 Maverick)
- **Sanitizzazione testo**: Sistema avanzato per ripulire le risposte da HTML/markdown

## Workflow dell'Applicazione
L'applicazione segue un workflow di "conversazione", dove:
1. L'utente invia un messaggio tramite l'interfaccia chat
2. Il backend elabora il messaggio e lo invia all'API OpenRouter
3. La risposta viene sanitizzata e arricchita con link pertinenti
4. I link vengono generati in modo contestuale, evitando ripetizioni
5. Il sistema tiene traccia degli argomenti discussi e dei link già forniti

## Casi d'Uso Principali
- Richiesta di informazioni sui traghetti dalla Costiera Amalfitana
- Domande su attività e luoghi di interesse
- Informazioni su spiagge e mare
- Consigli generali sul turismo nella regione

## Caratteristiche di Deployment
- Applicazione web ospitata su Replit
- Configurazione con workflow automatizzato
- Richiede la chiave API per OpenRouter

## Stato Attuale del Progetto
L'applicazione è pienamente funzionale, con miglioramenti continui su:
- Ottimizzazione della sanitizzazione del testo
- Miglioramento del sistema di gestione del contesto
- Perfezionamento del sistema di generazione dei link
- Ottimizzazione dell'UI per diversi dispositivi