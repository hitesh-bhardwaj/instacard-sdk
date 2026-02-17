
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function convertToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + convertToWords(Math.abs(num));

  let words = '';

  // Handle Crores (10,000,000)
  if (Math.floor(num / 10000000) > 0) {
    words += convertToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }

  // Handle Lakhs (100,000)
  if (Math.floor(num / 100000) > 0) {
    words += convertToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }

  // Handle Thousands
  if (Math.floor(num / 1000) > 0) {
    words += convertToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }

  // Handle Hundreds
  if (Math.floor(num / 100) > 0) {
    words += convertToWords(Math.floor(num / 100)) + ' Hundred ';
    num %= 100;
  }

  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += ' ' + ones[num % 10];
      }
    }
  }

  return words.trim();
}

function formatAmountInWords(amount: string): string {
  const numStr = amount.replace(/,/g, '');
  const num = parseInt(numStr, 10);
  
  if (isNaN(num) || num === 0) {
    return 'Zero Rupees';
  }
  
  return convertToWords(num) + ' Rupees';
}
