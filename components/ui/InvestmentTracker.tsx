'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from './Icons';
import { Card } from './Card';

interface Investment {
  id: string;
  name: string;
  type: 'saham' | 'gold' | 'crypto';
  units: number;
  avgPrice: number;
  currentPrice: number;
}

export function InvestmentTracker() {
  const [assets, setAssets] = useState<Investment[]>([
    { id: '1', name: 'BBCA', type: 'saham', units: 100, avgPrice: 9000, currentPrice: 9800 },
    { id: '2', name: 'Antam Gold', type: 'gold', units: 10, avgPrice: 1050000, currentPrice: 1120000 },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-sync market prices
  useEffect(() => {
    const syncPrices = async () => {
      setIsSyncing(true);
      try {
        // Use a functional update to avoid depending on 'assets' state directly
        setAssets(currentAssets => {
          // Trigger the async fetches for each asset
          Promise.all(currentAssets.map(async (asset) => {
            let ticker = asset.name;
            if (asset.type === 'saham' && !ticker.includes('.')) {
              ticker = `${ticker}.JK`;
            }

            try {
              const res = await fetch(`/api/market?symbol=${ticker}&type=${asset.type}`);
              const data = await res.json();
              if (data.price) {
                // Update the asset in the state
                setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, currentPrice: data.price } : a));
              }
            } catch (e) {
              console.error(`Failed to sync ${ticker}:`, e);
            }
          }));
          return currentAssets;
        });
      } finally {
        setIsSyncing(false);
      }
    };

    syncPrices();
    const interval = setInterval(syncPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Keeping it empty to only run once on mount and then via interval

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<Investment['type']>('saham');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');

  const totalValue = assets.reduce((acc, a) => acc + (a.units * a.currentPrice), 0);
  const totalCost = assets.reduce((acc, a) => acc + (a.units * a.avgPrice), 0);
  const profit = totalValue - totalCost;
  const profitPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const handleAdd = () => {
    if (!name || !units || !price) return;
    const newAsset: Investment = {
      id: Date.now().toString(),
      name: name.toUpperCase(),
      type,
      units: parseFloat(units),
      avgPrice: parseFloat(price),
      currentPrice: parseFloat(price)
    };
    setAssets([...assets, newAsset]);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !name || !units || !price) return;
    setAssets(assets.map(a => a.id === editingId ? {
      ...a,
      name: name.toUpperCase(),
      type,
      units: parseFloat(units),
      avgPrice: parseFloat(price)
    } : a));
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const startEdit = (asset: Investment) => {
    setEditingId(asset.id);
    setName(asset.name);
    setType(asset.type);
    setUnits(asset.units.toString());
    setPrice(asset.avgPrice.toString());
    setShowAdd(true);
  };

  const resetForm = () => {
    setName(''); setUnits(''); setPrice(''); setEditingId(null); setShowAdd(false);
  };

  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Investment Tracker</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isSyncing && (
            <span style={{ fontSize: '0.625rem', color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', animation: 'pulse 2s infinite' }}>
              Syncing Live...
            </span>
          )}
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            style={{ fontSize: '0.75rem', color: isEditing ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isEditing ? 'Done' : 'Manage'}
          </button>
          {!isEditing && (
            <button 
              onClick={() => setShowAdd(true)} 
              style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              + Buy
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: 'var(--surface-secondary)', borderRadius: '12px' }}>
        <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Total Portfolio Value</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-main)' }}>Rp {totalValue.toLocaleString('id-ID')}</div>
        <div style={{ fontSize: '0.875rem', color: profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {profit >= 0 ? <Icons.TrendingUpIcon /> : <Icons.TrendingDownIcon />} Rp {Math.abs(profit).toLocaleString('id-ID')} ({profitPct.toFixed(2)}%)
        </div>
      </div>

      {showAdd && (
        <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--surface-secondary)', borderRadius: '12px', border: '1px solid var(--primary-color)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px' }}>{editingId ? 'Edit Asset' : 'Add Asset'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Asset Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <select value={type} onChange={(e) => setType(e.target.value as any)} style={inputStyle}>
                <option value="saham">Stock</option>
                <option value="gold">Gold</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="number" placeholder="Units / Lots" value={units} onChange={(e) => setUnits(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Avg Buy Price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button onClick={resetForm} style={btnSecondary}>Cancel</button>
              <button onClick={editingId ? handleUpdate : handleAdd} style={btnPrimary}>{editingId ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {assets.map(asset => {
          const assetProfit = (asset.currentPrice - asset.avgPrice) * asset.units;
          return (
            <div key={asset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '10px', 
                  backgroundColor: 'var(--bg-color)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' 
                }}>
                  {asset.type === 'saham' ? <Icons.TrendingUpIcon /> : asset.type === 'gold' ? <Icons.CoinsIcon /> : <Icons.ZapIcon />}
                </div>
                <div className="flex flex-col">
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{asset.name}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{asset.units} {asset.type === 'gold' ? 'gr' : 'lots'} @ {asset.avgPrice.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>Rp {(asset.units * asset.currentPrice).toLocaleString('id-ID')}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: assetProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {assetProfit >= 0 ? '+' : ''}{assetProfit.toLocaleString('id-ID')}
                  </div>
                </div>
                {isEditing && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => startEdit(asset)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Icons.TagIcon /></button>
                    <button onClick={() => handleDelete(asset.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--danger-color)', background: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Icons.TrashIcon /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-main)',
  fontSize: '0.875rem',
  fontWeight: 600,
  outline: 'none',
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
};
