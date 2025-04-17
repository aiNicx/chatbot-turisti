interface LinkType {
  text: string;
  url: string;
}

/**
 * Simple language detection based on common words and patterns
 * This is a simplified approach - a production app would use a language detection library
 */
export function detectLanguage(text: string): string {
  const textLower = text.toLowerCase();
  
  // Check for Italian indicators
  if (
    textLower.includes(' il ') || 
    textLower.includes(' la ') || 
    textLower.includes(' del ') || 
    textLower.includes(' per ') || 
    textLower.includes('puoi ') ||
    textLower.includes('grazie')
  ) {
    return 'it';
  }
  
  // Check for German indicators
  if (
    textLower.includes(' der ') || 
    textLower.includes(' die ') || 
    textLower.includes(' das ') || 
    textLower.includes(' mit ') || 
    textLower.includes(' und ') ||
    textLower.includes('können')
  ) {
    return 'de';
  }
  
  // Check for Spanish indicators
  if (
    textLower.includes(' el ') || 
    textLower.includes(' los ') || 
    textLower.includes(' las ') || 
    textLower.includes(' para ') || 
    textLower.includes(' y ') ||
    textLower.includes('puede')
  ) {
    return 'es';
  }
  
  // Check for French indicators
  if (
    textLower.includes(' le ') || 
    textLower.includes(' la ') || 
    textLower.includes(' du ') || 
    textLower.includes(' pour ') || 
    textLower.includes(' et ') ||
    textLower.includes('pouvez')
  ) {
    return 'fr';
  }
  
  // Check for Russian indicators
  if (
    textLower.includes(' в ') || 
    textLower.includes(' и ') || 
    textLower.includes(' на ') || 
    textLower.includes(' с ') ||
    /[а-яА-Я]/.test(text)
  ) {
    return 'ru';
  }
  
  // Check for Chinese indicators (presence of Chinese characters)
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh';
  }
  
  // Default to English
  return 'en';
}

/**
 * Get company-specific button text in the appropriate language
 */
function getCompanyButtonText(company: string, language: string): string {
  switch (language) {
    case 'it':
      return `Orari ${company}`;
    case 'en':
      return `${company} schedules`;
    case 'de':
      return `${company} Fahrpläne`;
    case 'es':
      return `Horarios ${company}`;
    case 'fr':
      return `Horaires ${company}`;
    case 'ru':
      return `Расписание ${company}`;
    case 'zh':
      return `${company}时刻表`;
    default:
      return `${company}`;
  }
}

/**
 * Get activity button text in the appropriate language
 */
function getActivityButtonText(language: string): string {
  switch (language) {
    case 'it':
      return 'Esplora attività';
    case 'en':
      return 'Explore activities';
    case 'de':
      return 'Aktivitäten erkunden';
    case 'es':
      return 'Explorar actividades';
    case 'fr':
      return 'Explorer activités';
    case 'ru':
      return 'Просмотр мероприятий';
    case 'zh':
      return '探索活动';
    default:
      return 'Explore activities';
  }
}

/**
 * Get generic button text in the appropriate language
 */
function getGenericButtonText(language: string): string {
  switch (language) {
    case 'it':
      return 'Maggiori informazioni';
    case 'en':
      return 'More information';
    case 'de':
      return 'Weitere Informationen';
    case 'es':
      return 'Más información';
    case 'fr':
      return 'Plus d\'informations';
    case 'ru':
      return 'Подробнее';
    case 'zh':
      return '更多信息';
    default:
      return 'More information';
  }
}

/**
 * Extract links from text based on mentioned source sites
 * This is a simplified implementation - in a production app, 
 * we would do actual web searches to find relevant content
 */
export function extractLinksFromText(text: string, sourceSites: string[]): LinkType[] {
  const links: LinkType[] = [];
  
  // Get language from text to provide correct button labels
  const language = detectLanguage(text);
  
  // Rilevare il tema principale del messaggio
  const textLower = text.toLowerCase();
  
  // Rilevamento traghetti e barche
  const containsTraghetti = 
    textLower.includes('traghett') || 
    textLower.includes('ferry') || 
    textLower.includes('ferr') || 
    textLower.includes('boat') || 
    textLower.includes('паром') ||
    textLower.includes('渡船');
  
  // Rilevamento attività, cosa fare, percorsi
  const containsAttivita = 
    textLower.includes('attività') || 
    textLower.includes('activities') || 
    textLower.includes('sentiero') || 
    textLower.includes('path') || 
    textLower.includes('what to do') || 
    textLower.includes('cosa fare') || 
    textLower.includes('spiaggia') || 
    textLower.includes('beach');
  
  // CASO 1: Fornire link ai traghetti
  if (containsTraghetti) {
    // Aggiungi automaticamente link alle compagnie di traghetti più importanti
    const ferryCompanies = [
      { name: "Travelmar", url: "https://www.travelmar.it/" },
      { name: "Alicost", url: "https://www.alicost.it/" }
    ];
    
    // Aggiungi entrambe le compagnie
    for (const company of ferryCompanies) {
      links.push({
        text: getCompanyButtonText(company.name, language),
        url: company.url
      });
    }
    
    return links;
  }
  
  // CASO 2: Fornire link alle attività
  if (containsAttivita) {
    links.push({
      text: getActivityButtonText(language),
      url: "https://www.costieraamalfitana.com/"
    });
    
    return links;
  }
  
  // Continua con la logica normale se non si parla di traghetti
  
  // Check if any source site is mentioned in the text
  const mentionedSites: {site: string, cleanSite: string, url: string}[] = [];
  
  for (const site of sourceSites) {
    // Clean the site URL from http/https prefix for comparison
    const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Simplified check: just see if any domain keywords are present
    const domainKeywords = cleanSite.split('.')[0];
    if (textLower.includes(domainKeywords.toLowerCase())) {
      // Ensure the URL has http/https prefix
      let url = site;
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      
      mentionedSites.push({
        site,
        cleanSite,
        url
      });
    }
  }
  
  // Create links with company-specific labels
  for (const {cleanSite, url} of mentionedSites) {
    let buttonText = "";
    
    // Create specific button text for each company in the appropriate language
    if (cleanSite.includes("traghettilines")) {
      buttonText = getCompanyButtonText("Traghettilines", language);
    } else if (cleanSite.includes("travelmar")) {
      buttonText = getCompanyButtonText("Travelmar", language);
    } else if (cleanSite.includes("alicost")) {
      buttonText = getCompanyButtonText("Alicost", language);
    } else if (cleanSite.includes("costieraamalfitana")) {
      buttonText = getActivityButtonText(language);
    } else {
      buttonText = getGenericButtonText(language);
    }
    
    links.push({
      text: buttonText,
      url
    });
    
    // Limit to max 2 links per response
    if (links.length >= 2) break;
  }
  
  return links;
}
