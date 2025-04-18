# Sistema di Ricerca e Pulsanti per il Chatbot

Questo documento spiega il funzionamento del sistema di ricerca web e gestione dei pulsanti nel chatbot.

## File Principali

1. **ricerche_config.json**
   - File di configurazione centrale per tutte le categorie di ricerca
   - Contiene: keywords, risposte testuali e link per ogni categoria
   - Posizione: `server/ricerche_config.json`

2. **linkService.ts**
   - Servizio che gestisce la logica di matching delle categorie
   - Funzionalità:
     - Analizza i messaggi per trovare match con le categorie
     - Genera risposte e pulsanti appropriati
   - Posizione: `server/services/linkService.ts`

3. **routes.ts**
   - Integra il servizio nel flusso principale del chatbot
   - Posizione: `server/routes.ts`

4. **webSearchService.ts**
   - Mantiene la logica di ricerca generica come fallback
   - Posizione: `server/services/webSearchService.ts`

## Come Aggiungere una Nuova Categoria

### 1. Modificare ricerche_config.json

Aggiungere una nuova voce seguendo questo formato:

```json
"nome_categoria": {
  "keywords": ["parola1", "parola2"],
  "risposta": {
    "it": "Testo in italiano",
    "en": "Testo in inglese"
  },
  "links": [
    {
      "url": "https://esempio.com",
      "pulsanti": {
        "it": ["Testo pulsante italiano"],
        "en": ["Testo pulsante inglese"]
      }
    }
  ]
}
```

### 2. Esempio Pratico

Per aggiungere una categoria "ristoranti":

```json
"ristoranti": {
  "keywords": ["ristorante", "mangiare", "dove mangiare", "ristoranti"],
  "risposta": {
    "it": "Ecco alcuni ristoranti consigliati:",
    "en": "Here are some recommended restaurants:"
  },
  "links": [
    {
      "url": "https://www.tripadvisor.it/Restaurants",
      "pulsanti": {
        "it": ["Vedi ristoranti"],
        "en": ["View restaurants"]
      }
    }
  ]
}
```

## Flusso di Lavoro

1. Il sistema controlla se il messaggio contiene keywords di una categoria
2. Se trova un match:
   - Mostra la risposta testuale configurata
   - Genera pulsanti con i link corrispondenti
3. Se non trova match:
   - Usa la ricerca web generica come fallback

## Best Practices

1. Mantenere le keywords specifiche e non ambigue
2. Usare URL affidabili e ufficiali
3. Limitare a 2-3 pulsanti per categoria
4. Aggiornare i testi in tutte le lingue supportate

## Manutenzione

Per modificare una categoria esistente:
1. Aprire `ricerche_config.json`
2. Trovare la categoria da modificare
3. Aggiornare keywords, risposte o link
4. Le modifiche saranno attive al riavvio del server

## Struttura Dati

```mermaid
classDiagram
    class RicercheConfig {
        +[categoria]: {
            keywords: string[]
            risposta: { it: string, en: string }
            links: {
                url: string
                pulsanti: { it: string[], en: string[] }
            }[]
        }
    }
    
    class LinkService {
        +getLinksForMessage(message: string, lang: string): LinkResult
    }
    
    RicercheConfig --> LinkService : Fornisce configurazione