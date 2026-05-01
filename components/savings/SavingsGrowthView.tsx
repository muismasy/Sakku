import React, { useState, useMemo } from 'react';
import { usePrices } from '@/hooks/usePrices';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FAB } from '@/components/ui/FAB';
import { BottomSheet } from '@/components/ui/BottomSheet';
import * as Icons from '@/components/ui/Icons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface SavingsGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
}

interface InvestmentAsset {
  id: string;
  name: string;
  type: string;
  value: number;
  change: number;
}

export function SavingsGrowthView({ onSelectGoal, onSelectInvestment }: { onSelectGoal: (id: string) => void, onSelectInvestment: (id: string) => void }) {
  const { data: marketData, loading: marketLoading } = usePrices();

  // Savings goals state
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: '1', name: 'Emergency Fund', current: 5000000, target: 10000000, color: '#4F46E5' },
    { id: '2', name: 'Bali Holiday', current: 1500000, target: 5000000, color: '#0EA5E9' },
    { id: '3', name: 'New Laptop', current: 8000000, target: 15000000, color: '#8B5CF6' },
  ]);

  // Investment assets state
  const [investments, setInvestments] = useState<InvestmentAsset[]>([
    { id: '1', name: 'BBCA', type: 'Stock', value: 9000000, change: 4.5 },
    { id: '2', name: 'Antam Gold', type: 'Commodity', value: 10500000, change: 1.2 },
    { id: '3', name: 'Ethereum', type: 'Crypto', value: 4500000, change: -2.8 },
  ]);

  // Modal states
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);

  // New Goal state
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalColor, setNewGoalColor] = useState('#4F46E5');

  // New Asset state
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('Stock');
  const [newAssetValue, setNewAssetValue] = useState('');

  const totalSavings = goals.reduce((sum, g) => sum + g.current, 0);
  const totalGrowth = investments.reduce((sum, i) => sum + i.value, 0);
  const avgGrowthChange = investments.length > 0 ? investments.reduce((sum, i) => sum + i.change, 0) / investments.length : 0;

  const colorOptions = ['#4F46E5', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  // Handlers
  const handleAddGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    setGoals([...goals, {
      id: `g_${Date.now()}`,
      name: newGoalName,
      current: 0,
      target: parseInt(newGoalTarget, 10),
      color: newGoalColor,
    }]);
    setNewGoalName(''); setNewGoalTarget(''); setNewGoalColor('#4F46E5');
    setShowAddGoal(false);
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetValue) return;
    setInvestments([...investments, {
      id: `i_${Date.now()}`,
      name: newAssetName,
      type: newAssetType,
      value: parseInt(newAssetValue, 10),
      change: 0,
    }]);
    setNewAssetName(''); setNewAssetType('Stock'); setNewAssetValue('');
    setShowAddAsset(false);
  };

  const chartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Savings',
        data: [7000000, 8500000, 10000000, 11500000, 12500000, totalSavings],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4, fill: true, pointRadius: 0,
      },
      {
        label: 'Investments',
        data: [15000000, 16200000, 16000000, 18500000, 20000000, totalGrowth],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4, fill: true, pointRadius: 0,
      }
    ],
  }), [totalSavings, totalGrowth]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '120px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Savings & Growth</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Build your wealth and track your goals</p>
          </div>
          {marketData && (
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: 'var(--success-color)', fontWeight: 600 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} /> Market Cached
              </div>
              Updated: {marketData.lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* Market Overview Row */}
      <section>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {marketLoading ? (
            [1,2,3].map(i => <div key={i} style={{ minWidth: '140px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--surface-secondary)', animation: 'pulse 2s infinite' }} />)
          ) : marketData?.stocks.concat(marketData.commodities as any).slice(0, 4).map((item: any) => (
            <Card key={item.id} flat style={{ minWidth: '140px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>{item.price ? item.price.toLocaleString() : item.priceGram.toLocaleString()}</div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: item.change >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {item.change >= 0 ? '↑' : '↓'}{Math.abs(item.change)}%
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Growth Chart */}
      <Card style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px' }}>Portfolio Growth</h2>
        <div style={{ height: '220px', width: '100%' }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
        </div>
      </Card>

      {/* Savings Section */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Savings Goals</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.map(goal => (
            <Card key={goal.id} style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onSelectGoal(goal.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    <Icons.TargetIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>{goal.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rp {goal.current.toLocaleString()} / {goal.target.toLocaleString()}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: goal.color }}>{Math.round((goal.current / goal.target) * 100)}%</span>
              </div>
              <ProgressBar value={goal.current} max={goal.target} color={goal.color} height={8} />
            </Card>
          ))}
        </div>
      </section>

      {/* Investments Section */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Investment Assets</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {investments.map(asset => (
            <Card key={asset.id} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => onSelectInvestment(asset.id)}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {asset.type === 'Stock' ? <Icons.TrendingUpIcon /> : <Icons.CoinsIcon />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{asset.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.type}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Rp {asset.value.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: asset.change >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>{asset.change >= 0 ? '+' : ''}{asset.change}%</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAB and Modals */}
      <FAB onClick={() => setIsFabMenuOpen(true)} />

      <BottomSheet open={isFabMenuOpen} onClose={() => setIsFabMenuOpen(false)} title="Add to Portfolio">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
          <button onClick={() => { setIsFabMenuOpen(false); setShowAddGoal(true); }} style={actionBtnStyle}>
            <Icons.TargetIcon /> Add Savings Goal
          </button>
          <button onClick={() => { setIsFabMenuOpen(false); setShowAddAsset(true); }} style={actionBtnStyle}>
            <Icons.TrendingUpIcon /> Add Investment Asset
          </button>
        </div>
      </BottomSheet>

      <BottomSheet open={showAddGoal} onClose={() => setShowAddGoal(false)} title="New Savings Goal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
          <input placeholder="Goal Name" value={newGoalName} onChange={e => setNewGoalName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Target Amount" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '8px' }}>
            {colorOptions.map(c => (
              <div key={c} onClick={() => setNewGoalColor(c)} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c, border: newGoalColor === c ? '2px solid black' : 'none', cursor: 'pointer' }} />
            ))}
          </div>
          <button onClick={handleAddGoal} style={submitBtnStyle}>Create Goal</button>
        </div>
      </BottomSheet>

      <BottomSheet open={showAddAsset} onClose={() => setShowAddAsset(false)} title="New Investment Asset">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
          <input placeholder="Asset Name" value={newAssetName} onChange={e => setNewAssetName(e.target.value)} style={inputStyle} />
          <select value={newAssetType} onChange={e => setNewAssetType(e.target.value)} style={inputStyle}>
            <option>Stock</option>
            <option>Commodity</option>
            <option>Crypto</option>
          </select>
          <input type="number" placeholder="Initial Value" value={newAssetValue} onChange={e => setNewAssetValue(e.target.value)} style={inputStyle} />
          <button onClick={handleAddAsset} style={submitBtnStyle}>Add Asset</button>
        </div>
      </BottomSheet>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
  borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)',
  fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer'
};

const inputStyle: React.CSSProperties = {
  padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem'
};

const submitBtnStyle: React.CSSProperties = {
  padding: '16px', borderRadius: '12px', border: 'none', 
  backgroundColor: 'var(--primary-color)', color: 'white',
  fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '8px'
};
