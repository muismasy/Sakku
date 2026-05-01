import { Transaction } from '../types';

/**
 * Placeholder for Gemini NLP parsing.
 * In a real implementation, this would call the Gemini API
 * to extract structure from informal text.
 */
export async function parseTransactionWithNLP(text: string, userId: string): Promise<Partial<Transaction>> {
  console.log("Parsing text with NLP:", text);
  
  const lowerText = text.toLowerCase();
  
  let amount = 0;
  let category = 'Uncategorized';
  let type: 'expense' | 'income' | 'transfer' = 'expense';
  
  // Basic Regex to find amount (e.g., 50rb -> 50000)
  const rbMatch = lowerText.match(/(\d+)rb/);
  if (rbMatch && rbMatch[1]) {
    amount = parseInt(rbMatch[1], 10) * 1000;
  } else {
    // try to match just numbers
    const numMatch = lowerText.match(/(\d+)/);
    if (numMatch && numMatch[1]) {
      amount = parseInt(numMatch[1], 10);
    }
  }

  // Basic category matching
  if (lowerText.includes('kopi') || lowerText.includes('makan')) {
    category = 'Food';
  } else if (lowerText.includes('gojek') || lowerText.includes('grab')) {
    category = 'Transport';
  } else if (lowerText.includes('gaji')) {
    category = 'Salary';
    type = 'income';
  }

  return {
    added_by_user_id: userId,
    amount,
    category,
    type,
    description: text,
    date: Date.now(),
    source: 'whatsapp',
    raw_message: text
  };
}
