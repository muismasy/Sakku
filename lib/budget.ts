import { BudgetEnvelope, Transaction } from '../types';
import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * Checks the budget after a transaction is recorded.
 * If spending exceeds 80% or 100%, sends a simulated WhatsApp alert.
 */
export async function checkBudgetAlerts(transaction: Transaction) {
  if (transaction.type !== 'expense') return;

  try {
    if (!db) {
      console.warn("Firestore 'db' is not initialized. Skipping budget check.");
      return;
    }
    // 1. Fetch budget envelope for the user and category
    const budgetRef = collection(db, 'budgets');
    const q = query(
      budgetRef, 
      where('ledger_id', '==', transaction.ledger_id),
      where('category', '==', transaction.category)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No budget envelope found for category: ${transaction.category}`);
      return;
    }

    const envelopeDoc = querySnapshot.docs[0];
    const envelope = envelopeDoc.data() as BudgetEnvelope;
    
    // In a real app we'd aggregate current month's transactions.
    // For now we assume envelope.current_spent is updated or we just add this transaction's amount.
    const newSpent = envelope.current_spent + transaction.amount;
    const percentage = newSpent / envelope.monthly_limit;

    console.log(`Budget for ${transaction.category}: Spent ${newSpent} / ${envelope.monthly_limit} (${Math.round(percentage * 100)}%)`);

    let updates: Partial<BudgetEnvelope> = { current_spent: newSpent };
    let shouldAlert = false;
    let alertMessage = '';

    if (percentage >= 1 && !envelope.alert_sent_100) {
      alertMessage = `🚨 Alert: You have exceeded 100% of your budget for ${transaction.category}! (Spent: ${newSpent}/${envelope.monthly_limit})`;
      updates.alert_sent_100 = true;
      shouldAlert = true;
    } else if (percentage >= 0.8 && percentage < 1 && !envelope.alert_sent_80) {
      alertMessage = `⚠️ Warning: You have reached 80% of your budget for ${transaction.category}. (Spent: ${newSpent}/${envelope.monthly_limit})`;
      updates.alert_sent_80 = true;
      shouldAlert = true;
    }

    // 2. Update envelope in Firestore
    await updateDoc(doc(db, 'budgets', envelopeDoc.id), updates);

    // 3. Send WhatsApp Alert if needed
    if (shouldAlert) {
      await sendWhatsAppAlert(transaction.added_by_user_id, alertMessage);
    }
  } catch (error) {
    console.error("Error checking budget alerts: ", error);
  }
}

async function sendWhatsAppAlert(userId: string, message: string) {
  console.log(`\n[SIMULATED WHATSAPP API] Sending message to ${userId}:\n${message}\n`);
  // In a real implementation, this would make an HTTP POST to WhatsApp Graph API:
  /*
  await fetch(`https://graph.facebook.com/v17.0/PHONE_NUMBER_ID/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: userId, // Assuming userId is the phone number here
      type: "text",
      text: { body: message }
    })
  });
  */
}
