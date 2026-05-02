'use client';

import { useState, useEffect } from 'react';

export interface PriceData {
  stocks: { id: string; name: string; symbol: string; price: number; change: number; type: string }[];
  commodities: { id: string; name: string; symbol: string; priceGram: number; change: number; type: string }[];
  updatedAt: string;
  source: 'cache' | 'api';
  lastUpdated: string;
}

export function usePrices() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch('/api/prices');
        const json = await response.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return { data, loading, error };
}
