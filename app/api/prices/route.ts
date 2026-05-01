import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the cache file path inside the src folder for persistence in dev
const CACHE_FILE = path.join(process.cwd(), 'src/app/api/prices/cache.json');

export async function GET() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
    // 1. Check if cache exists and is fresh for today
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (cacheData.lastUpdated === today) {
        return NextResponse.json({ ...cacheData.data, source: 'cache', lastUpdated: cacheData.lastUpdated });
      }
    }

    // 2. Fetch new data (Using mock data logic for now, but ready for real API integration)
    // In a real scenario, you would fetch from Alpha Vantage / GoldAPI here
    const newData = {
      stocks: [
        { id: 's1', name: 'BBCA', symbol: 'BBCA.JK', price: 9850, change: 0.75, type: 'stock' },
        { id: 's2', name: 'TLKM', symbol: 'TLKM.JK', price: 4020, change: -1.2, type: 'stock' },
        { id: 's3', name: 'ASII', symbol: 'ASII.JK', price: 5125, change: 0.25, type: 'stock' },
        { id: 's4', name: 'GOTO', symbol: 'GOTO.JK', price: 68, change: -2.8, type: 'stock' },
      ],
      commodities: [
        { id: 'c1', name: 'Gold (Antam)', symbol: 'XAU', priceGram: 1128000, change: 0.15, type: 'metal' },
        { id: 'c2', name: 'Silver', symbol: 'XAG', priceGram: 14650, change: -0.4, type: 'metal' },
      ],
      updatedAt: now.toLocaleString('id-ID'),
    };

    // 3. Save to cache
    const cacheToSave = {
      lastUpdated: today,
      data: newData
    };

    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheToSave));

    return NextResponse.json({ ...newData, source: 'api', lastUpdated: today });
  } catch (error) {
    console.error('Price API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
