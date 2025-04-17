interface LinkType {
  text: string;
  url: string;
}

/**
 * Extract links from text based on mentioned source sites
 * This is a simplified implementation - in a production app, 
 * we would do actual web searches to find relevant content
 */
export function extractLinksFromText(text: string, sourceSites: string[]): LinkType[] {
  const links: LinkType[] = [];
  
  // Check if any source site is mentioned in the text
  for (const site of sourceSites) {
    if (text.toLowerCase().includes(site.toLowerCase())) {
      // Different button text based on the site
      let buttonText = "Vedi sito";
      
      if (site.includes("traghetti")) {
        buttonText = "Vedi orari";
      } else if (site.includes("musei")) {
        buttonText = "Acquista";
      } else if (site.includes("costiera")) {
        buttonText = "Esplora";
      }
      
      links.push({
        text: buttonText,
        url: `https://${site}`
      });
      
      // Limit to max 2 links per response
      if (links.length >= 2) break;
    }
  }
  
  return links;
}
