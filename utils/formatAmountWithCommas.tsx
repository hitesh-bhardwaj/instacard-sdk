/**
 * Formats a numeric string or number with commas as thousand separators
 * following Indian numbering system (e.g., 1,00,000 for 100000)
 * @param amount - The amount to format (string or number)
 * @returns Formatted string with commas
 */
export function formatAmountWithCommas(amount: string | number): string {
  // Convert to string and remove any existing commas
  const numStr = String(amount).replace(/,/g, '');
  
  // Handle empty or invalid input
  if (!numStr || numStr === '0') {
    return '0';
  }
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');
  
  // Format integer part with Indian numbering system
  // First 3 digits from right, then groups of 2
  let formatted = '';
  const len = integerPart.length;
  
  if (len <= 3) {
    formatted = integerPart;
  } else {
    // Last 3 digits
    formatted = integerPart.slice(-3);
    let remaining = integerPart.slice(0, -3);
    
    // Add groups of 2 from right to left
    while (remaining.length > 0) {
      const chunk = remaining.slice(-2);
      formatted = chunk + ',' + formatted;
      remaining = remaining.slice(0, -2);
    }
  }
  
  // Add decimal part if exists
  if (decimalPart !== undefined) {
    formatted += '.' + decimalPart;
  }
  
  return formatted;
}

export default formatAmountWithCommas;
