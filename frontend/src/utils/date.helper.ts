export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  
  // Validamos si la fecha es válida
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};