import config from '../ricerche_config.json';

type Language = 'it' | 'en';

interface LinkResult {
  text: string;
  links: Array<{
    url: string;
    text: string;
  }>;
}

export function getLinksForMessage(message: string, lang: Language = 'it'): LinkResult | null {
  const lowerMsg = message.toLowerCase();
  
  // Cerca la prima categoria che matcha
  for (const [category, data] of Object.entries(config)) {
    if (data.keywords.some(kw => lowerMsg.includes(kw.toLowerCase()))) {
      return {
        text: data.risposta[lang as Language] || data.risposta.it,
        links: data.links.map(link => ({
          url: link.url,
          text: link.pulsanti[lang as Language]?.[0] || link.pulsanti.it[0]
        }))
      };
    }
  }
  
  return null;
}

export function updateLinkUsageStats(url: string): void {
  // Qui potremmo aggiungere logica per tracciare l'uso dei link
  console.log(`Link utilizzato: ${url}`);
}