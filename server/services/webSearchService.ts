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
  
  // Remove any URL button syntax from the original message so they don't appear in the text
  // This prevents text like: "(button: «text» → URL)" from showing in the message
  const cleanedText = text.replace(/\((?:button|pulsante): «([^»]+)» → ([^)]+)\)/g, '');
  
  // Check if any source site is mentioned in the text
  for (const site of sourceSites) {
    // Clean the site URL from http/https prefix for comparison
    const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Check if site is mentioned in the text
    if (cleanedText.toLowerCase().includes(cleanSite.toLowerCase())) {
      // Different button text based on the site domain
      let buttonText = "Maggiori informazioni";
      
      if (cleanSite.includes("traghettilines") || cleanSite.includes("travelmar") || cleanSite.includes("alicost")) {
        buttonText = "Orari traghetti";
      } else if (cleanSite.includes("costieraamalfitana")) {
        buttonText = "Esplora attività";
      }
      
      // Ensure the URL has http/https prefix
      let url = site;
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      
      links.push({
        text: buttonText,
        url
      });
      
      // Limit to max 2 links per response
      if (links.length >= 2) break;
    }
  }
  
  return links;
}
