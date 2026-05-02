import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

// Set runtime to nodejs since yahoo-finance2 needs it
export const runtime = 'nodejs';
export const revalidate = 3600; // Cache results for 1 hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const type = searchParams.get('type');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    if (type === 'gold') {
      // Logic for Gold in IDR per gram
      // GC=F is Gold Futures in USD/ounce
      // IDR=X is USD/IDR exchange rate
      const [goldData, exchangeRate] = await Promise.all([
        yahooFinance.quote('GC=F'),
        yahooFinance.quote('IDR=X')
      ]);

      const priceInUSDPerOunce = goldData.regularMarketPrice || 0;
      const usdToIdr = exchangeRate.regularMarketPrice || 0;
      
      // 1 Troy Ounce = 31.1034768 grams
      const priceInIdrPerGram = (priceInUSDPerOunce / 31.1034768) * usdToIdr;

      return NextResponse.json({
        symbol,
        price: Math.round(priceInIdrPerGram),
        currency: 'IDR',
        updatedAt: new Date().toISOString()
      });
    } else {
      // Logic for Stocks (Indonesian stocks use .JK suffix)
      const quote = await yahooFinance.quote(symbol);
      
      return NextResponse.json({
        symbol,
        price: quote.regularMarketPrice || 0,
        currency: quote.currency || 'IDR',
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch market data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
