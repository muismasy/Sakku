'use client';

import { RecurringExpenseCard } from './RecurringExpenseCard';
import { RecurringExpense } from '@/types';
import { Card, Tabs, BottomSheet } from '@/components/ui';
import * as Icons from '../ui/Icons';

export function RecurringExpensesView() {
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  
  const [expenses, setExpenses] = useState<RecurringExpense[]>([
    {
      id: '1',
      ledgerId: 'l1',
      title: 'Home Mortgage',
      category: 'Housing',
      monthlyAmount: 3500000,
      billingDay: 5,
      totalMonths: 180,
      remainingMonths: 142,
      startDate: Date.now() - (38 * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5).getTime()
    },
    {
      id: '2',
      ledgerId: 'l1',
      title: 'Motorcycle Installment',
      category: 'Transport',
      monthlyAmount: 850000,
      billingDay: 12,
      totalMonths: 36,
      remainingMonths: 12,
      startDate: Date.now() - (24 * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth(), 12).getTime()
    },
    {
      id: '3',
      ledgerId: 'l1',
      title: 'Netflix & Spotify',
      category: 'Entertainment',
      monthlyAmount: 250000,
      billingDay: 1,
      totalMonths: 999,
      remainingMonths: 999,
      startDate: Date.now() - (12 * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
    }
  ]);

  const filteredExpenses = expenses.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const totalMonthly = expenses
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + e.monthlyAmount, 0);

  const handleToggleStatus = (id: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'active' ? 'paused' : 'active';
        return { ...e, status: nextStatus as any };
      }
      return e;
    }));
  };

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: any = {
      id: editingExpense?.id || `rec_${Date.now()}`,
      ledgerId: 'l1',
      title: formData.get('title'),
      category: formData.get('category'),
      monthlyAmount: Number(formData.get('amount')),
      billingDay: Number(formData.get('billingDay')),
      totalMonths: Number(formData.get('totalMonths')),
      remainingMonths: Number(formData.get('totalMonths')),
      startDate: Date.now(),
      status: 'active',
      nextBillingDate: Date.now()
    };

    if (editingExpense) {
      setExpenses(prev => prev.map(ex => ex.id === editingExpense.id ? newExpense : ex));
    } else {
      setExpenses(prev => [...prev, newExpense]);
    }
    
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>Recurring Manager</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Manage automated rules and installments</p>
      </div>

      {/* Summary Stat */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Commitment</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>Rp {totalMonthly.toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Rules</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>{expenses.filter(e => e.status === 'active').length}</div>
          </div>
        </div>
        <button 
          onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
          style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '10px', 
            fontWeight: 700, 
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
          }}
        >
          + Add Rule
        </button>
      </div>

      {/* Tabs */}
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'active', label: 'Active' },
          { key: 'paused', label: 'Paused' },
          { key: 'all', label: 'All' }
        ]}
      />

      {/* Expenses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredExpenses.map((expense) => (
          <div key={expense.id} style={{ position: 'relative' }}>
            <RecurringExpenseCard 
              expense={expense}
              onToggleStatus={() => handleToggleStatus(expense.id)}
              onClick={() => handleEdit(expense)}
            />
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
               <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '4px' }}>
                 Day {expense.billingDay}
               </span>
               <button 
                 onClick={(e) => { e.stopPropagation(); handleDelete(expense.id); }}
                 style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger-color)', fontSize: '0.75rem' }}
               >
                 Delete
               </button>
            </div>
          </div>
        ))}
      </div>

      <BottomSheet open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? 'Edit Recurring Rule' : 'New Recurring Rule'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 4px 24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>DESCRIPTION</label>
            <input name="title" defaultValue={editingExpense?.title} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }} placeholder="e.g., Netflix, Home Rent" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>AMOUNT (RP)</label>
              <input name="amount" type="number" defaultValue={editingExpense?.monthlyAmount} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }} placeholder="500000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>BILLING DAY (1-31)</label>
              <input name="billingDay" type="number" min="1" max="31" defaultValue={editingExpense?.billingDay || 1} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }} placeholder="1" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>CATEGORY</label>
              <select name="category" defaultValue={editingExpense?.category || 'Housing'} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>TENURE (MONTHS)</label>
              <input name="totalMonths" type="number" defaultValue={editingExpense?.totalMonths || 12} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 700, marginTop: '12px' }}>
            {editingExpense ? 'Update Rule' : 'Create Rule'}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}

