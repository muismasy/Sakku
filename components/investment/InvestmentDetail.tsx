'use client';

import React, { useState } from 'react';
import * as Icons from '../ui/Icons';

interface Holding {
  id: string;
  name: string;
  units: number;
  avgPrice: number;
  currentPrice: number;
}

export function InvestmentDetail({ investmentId, onBack }: { investmentId: string, onBack: () => void }) {
  const [title, setTitle] = useState('Stock Portfolio');
  const [isEditing, setIsEditing] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [assetType, setAssetType] = useState('Equity / Stocks');
  
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', name: 'BBCA', units: 50, avgPrice: 9200, currentPrice: 9800 },
    { id: '2', name: 'TLKM', units: 200, avgPrice: 3800, currentPrice: 4050 },
  ]);
  
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUnits, setNewUnits] = useState('');
  const [newAvgPrice, setNewAvgPrice] = useState('');

  const totalValue = holdings.reduce((acc, h) => acc + (h.units * h.currentPrice), 0);
  const totalCost = holdings.reduce((acc, h) => acc + (h.units * h.avgPrice), 0);
  const totalProfit = totalValue - totalCost;
  const profitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100) : 0;

  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const handleDeleteAsset = () => {
    if (confirm(`Delete investment portfolio "${title}"? This will remove all holdings within it.`)) {
      onBack();
    }
  };

  const handleAddHolding = () => {
    if (!newName || !newUnits || !newAvgPrice) return;
    const holding: Holding = {
      id: `h_${Date.now()}`,
      name: newName.toUpperCase(),
      units: parseInt(newUnits, 10),
      avgPrice: parseInt(newAvgPrice, 10),
      currentPrice: parseInt(newAvgPrice, 10),
    };
    setHoldings([...holdings, holding]);
    setNewName(''); setNewUnits(''); setNewAvgPrice(''); setShowAddHolding(false);
  };

  const handleDeleteHolding = (id: string) => {
    const h = holdings.find(h => h.id === id);
    if (h && confirm(`Remove ${h.name} from portfolio?`)) {
      setHoldings(holdings.filter(h => h.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={onBack} style={headerButtonStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsEditing(!isEditing)} style={{ ...headerButtonStyle, color: isEditing ? 'var(--primary-color)' : 'var(--text-main)' }}>
            {isEditing ? <><Icons.CheckIcon /> Done</> : <><Icons.TagIcon /> Edit</>}
          </button>
          {!isEditing && (
            <button onClick={handleDeleteAsset} style={{ ...headerButtonStyle, color: 'var(--danger-color)' }}>
              <Icons.TrashIcon />
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}><Icons.TrendingUpIcon /></div>
        {isEditing ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', border: 'none', borderBottom: '2px solid var(--primary-color)', outline: 'none', background: 'none', width: '100%', padding: '4px 0' }} />
        ) : (
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>{title}</h1>
        )}
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatCurrency(totalValue)}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: totalProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          {totalProfit >= 0 ? <Icons.TrendingUpIcon /> : <Icons.TrendingDownIcon />} {totalProfit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
        </div>
      </div>

      {/* Holdings Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Holdings</h3>
          <button onClick={() => setShowAddHolding(true)} style={{ backgroundColor: 'var(--surface-secondary)', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>
        </div>

        {showAddHolding && (
          <div style={{ padding: '20px', backgroundColor: 'var(--surface-secondary)', borderRadius: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Ticker (e.g. BBCA)" value={newName} onChange={e => setNewName(e.target.value)} style={editInputStyle} />
            <input type="number" placeholder="Units" value={newUnits} onChange={e => setNewUnits(e.target.value)} style={editInputStyle} />
            <input type="number" placeholder="Avg Price" value={newAvgPrice} onChange={e => setNewAvgPrice(e.target.value)} style={editInputStyle} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddHolding(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleAddHolding} style={btnPrimary}>Save</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {holdings.map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{h.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.units} units @ {h.avgPrice.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(h.units * h.currentPrice)}</div>
                </div>
                {isEditing && (
                  <button onClick={() => handleDeleteHolding(h.id)} style={{ color: 'var(--danger-color)', cursor: 'pointer', padding: '4px', border: 'none', background: 'none' }}>
                    <Icons.TrashIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: '120px' }} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const headerButtonStyle: React.CSSProperties = {
  background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
  fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', padding: '8px'
};

const editInputStyle: React.CSSProperties = {
  width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9375rem', outline: 'none'
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer'
};

const btnSecondary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer'
};
