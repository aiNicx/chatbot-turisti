# Documentazione Amalfi Coast Bot

## Indice
1. [Panoramica del Progetto](./01_panoramica_progetto.md)
2. [Architettura e Flussi](./02_architettura_e_flussi.md)
3. [Supporto Multilingua e Funzionalità](./03_supporto_multilingua_e_features.md)
4. [Debug e Risoluzione Problemi](./04_debug_e_risoluzione_problemi.md)

## Introduzione Rapida

"Amalfi Coast Bot" è un'applicazione chat per assistenza turistica sulla Costiera Amalfitana. L'applicazione è progettata con un'interfaccia full-screen, ottimizzata per dispositivi mobili, e offre informazioni su trasporti, attività, alloggi ed eventi nella regione, con supporto multilingua automatico.

### Tecnologie Principali
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js/Express
- AI: OpenRouter API (Llama 4 Maverick)
- Sistemi custom: rilevamento lingua, sanitizzazione testo, contesto conversazione

### Setup Rapido
1. L'applicazione richiede una chiave API OpenRouter (`OPENROUTER_API_KEY`)
2. Il workflow "Start application" avvia sia il backend che il frontend
3. Non sono necessarie configurazioni DB (storage in-memory)

### Funzionalità Chiave
- Chat reattiva ottimizzata per mobile
- Rilevamento automatico della lingua
- Link contestuali alle risorse pertinenti
- UI/UX migliorata con animazioni fluide

## Contesto del Progetto

Questa documentazione fornisce una panoramica completa dell'applicazione "Amalfi Coast Bot", coprendo:

- Obiettivi e funzionalità principali
- Architettura tecnica e flussi di esecuzione
- Implementazione del supporto multilingua
- Sistema di tracciamento del contesto conversazionale
- Debugging e risoluzione dei problemi comuni

Consultare i singoli file di documentazione per informazioni dettagliate su aspetti specifici del progetto.