import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating a daily update price source
  // In a real scenario, this could fetch from a free daily API or a cached database
  const prices = {
    'BBCA': 9850,
    'ASII': 5150,
    'TLKM': 3420,
    'GOTO': 62,
    'Antam Gold': 1135000,
  };

  return NextResponse.json({
    date: new Date().toISOString().split('T')[0], // Current date
    prices
  });
}
