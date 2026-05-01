'use client';

import React, { useState } from 'react';

export function SakuPots() {
  const [pots, setPots] = useState([
    { id: '1', name: 'Emergency Fund', current: 5000000, target: 10000000, color: '#2383E2' },
    { id: '2', name: 'Bali Holiday', current: 1500000, target: 5000000, color: '#0F7B6C' }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const startEditing = (pot: any) => {
    setEditingId(pot.id);
    setEditName(pot.name);
    setEditTarget(pot.target.toString());
  };

  const saveEdit = (id: string) => {
    setPots(pots.map(p => p.id === id ? { ...p, name: editName, target: parseInt(editTarget, 10) || p.target } : p));
    setEditingId(null);
  };

  const deletePot = (id: string) => {
    if (confirm('Are you sure?')) {
      setPots(pots.filter(p => p.id !== id));
    }
  };

  const adjustAmount = (id: string, delta: number) => {
    setPots(pots.map(p => p.id === id ? { ...p, current: Math.max(0, p.current + delta) } : p));
  };

  const addNewPot = () => {
    const name = prompt('Goal name:');
    const target = prompt('Target (Rp):');
    if (name && target) {
      setPots([...pots, {
        id: Date.now().toString(),
        name,
        target: parseInt(target, 10) || 1000000,
        current: 0,
        color: '#2383E2'
      }]);
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>SAVINGS GOALS</h2>
        <button onClick={addNewPot} style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>+ Add</button>
      </div>
      
      <div className="flex flex-col gap-6">
        {pots.map(pot => {
          const progress = Math.min(100, (pot.current / pot.target) * 100);
          const isEditing = editingId === pot.id;

          return (
            <div key={pot.id} className="flex flex-col gap-2">
              {isEditing ? (
                <div className="flex flex-col gap-2" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--surface-secondary)' }}>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%', padding: '4px 0' }}
                  />
                  <input 
                    type="number" 
                    value={editTarget} 
                    onChange={(e) => setEditTarget(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', padding: '4px 0' }}
                  />
                  <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
                    <button onClick={() => deletePot(pot.id)} style={{ fontSize: '0.7rem', color: 'var(--danger-color)' }}>Delete</button>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingId(null)} style={{ fontSize: '0.7rem' }}>Cancel</button>
                      <button onClick={() => saveEdit(pot.id)} style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600 }}>Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pot.name}</span>
                        <button onClick={() => startEditing(pot)} style={{ opacity: 0.3, fontSize: '0.75rem' }}>edit</button>
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Rp {pot.current.toLocaleString('id-ID')} / {pot.target.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => adjustAmount(pot.id, -100000)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>-</button>
                      <button onClick={() => adjustAmount(pot.id, 100000)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>+</button>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: pot.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
