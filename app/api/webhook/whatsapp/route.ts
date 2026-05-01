import { NextResponse } from 'next/server';
import { parseTransactionWithNLP } from '@/lib/nlp';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { checkBudgetAlerts } from '@/lib/budget';
import { Transaction } from '@/types';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'sakku_verify_token_123';

// Handler for WhatsApp Webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// Handler for incoming WhatsApp messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp API webhook event
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages && change.value.messages[0]) {
            const message = change.value.messages[0];
            const senderPhone = message.from; // Phone number of the sender
            
            if (message.type === 'text') {
              const text = message.text.body;
              console.log(`Received text from ${senderPhone}: ${text}`);
              
              // Mock resolving user and ledger based on phone number.
              // In reality, we'd query Firestore for a User and their defaultLedgerId.
              const mockUserId = `user_${senderPhone}`;
              const mockLedgerId = 'ledger_123'; // Default shared ledger
              
              // 1. Parse text with NLP
              const transactionData = await parseTransactionWithNLP(text, mockUserId);
              
              // Map old userId to new ledgerId structure
              const newTransaction: Partial<Transaction> = {
                ...transactionData,
                ledgerId: mockLedgerId,
                addedByUserId: mockUserId
              };
              
              // 2. Save to Firestore
              try {
                if (!db) {
                  console.warn("Firestore 'db' is not initialized. Skipping save.");
                } else {
                  const transactionsRef = collection(db, 'transactions');
                  const docRef = await addDoc(transactionsRef, newTransaction);
                  console.log("Transaction saved with ID: ", docRef.id);
                  
                  // 3. Trigger budget alerts check (Phase 3 logic)
                  await checkBudgetAlerts(newTransaction as Transaction);
                }
              } catch (e) {
                console.error("Error adding document to Firestore (expected if using mock config): ", e);
              }
            }
          }
        }
      }
      return NextResponse.json({ status: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'not a whatsapp event' }, { status: 404 });
    }
  } catch (error) {
    console.error("Webhook POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
