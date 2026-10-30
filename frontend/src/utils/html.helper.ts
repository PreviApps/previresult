/**
 * Limpia cadenas de texto HTML provenientes de reportes médicos, 
 * convirtiéndolas en texto plano limpio y legible para React.
 */
export const cleanHtmlReport = (htmlString: string | null | undefined): string => {
  if (!htmlString) return "";

  // 1. Reemplazamos <br> y saltos de línea con espacios o saltos reales según convenga
  let cleanText = htmlString
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n');

  // 2. Removemos todas las demás etiquetas HTML restantes (<em>, <strong>, <p>, etc.)
  cleanText = cleanText.replace(/<[^>]*>?/gm, '');

  // 3. Decodificamos entidades HTML comunes ( , á, etc.)
  // Si estás en entorno web/navegador, podemos usar un elemento temporal del DOM de forma segura:
  const parser = new DOMParser();
  const decodedDom = parser.parseFromString(cleanText, 'text/html');
  cleanText = decodedDom.body.textContent || "";

  // 4. Limpiamos espacios múltiples y saltos de línea excesivos
  cleanText = cleanText
    .replace(/\r?\n|\r/g, '\n') // Normalizar saltos
    .replace(/[ \t]+/g, ' ')      // Espacios múltiples a uno solo
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0) // Filtramos líneas vacías sobrantes
    .join('\n');

  return cleanText.trim();
};