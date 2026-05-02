export type Transaction = {
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string | number; // Support timestamp or ISO string
};

export type UserData = {
  transactions: Transaction[];
  totalSaving: number;
  totalIncome: number;
  investmentNow: number;
  investmentPrev: number;
  budgetLimit: number;
};

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

const getDaysDifference = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const filterTransactionsByDays = (transactions: Transaction[], days: number) => {
  const now = new Date();
  return transactions.filter(t => {
    const tDate = new Date(t.date);
    return getDaysDifference(tDate, now) <= days;
  });
};

const filterTransactionsByCurrentMonth = (transactions: Transaction[]) => {
  const now = new Date();
  return transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
  });
};

const sumAmount = (transactions: Transaction[]) => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

// ==========================================
// 2. LOGIC EVALUATORS
// ==========================================

const isMasterNabung = (user: UserData) => {
  if (user.totalIncome === 0) return false;
  return (user.totalSaving / user.totalIncome) >= 0.2;
};

const isSuhuInvestasi = (user: UserData) => {
  if (user.investmentPrev === 0) {
    // If they just started and have investment > 0, they technically increased it infinitely, 
    // but to be fair, let's require at least some previous baseline, or just say true if it's a big amount.
    return user.investmentNow > 0; 
  }
  return (user.investmentNow - user.investmentPrev) / user.investmentPrev >= 0.3;
};

const isMesinUang = (user: UserData) => {
  const currentMonthTxs = filterTransactionsByCurrentMonth(user.transactions);
  const sideHustleTxs = currentMonthTxs.filter(
    t => t.type === 'income' && !t.category.toLowerCase().includes('salary') && !t.category.toLowerCase().includes('gaji')
  );
  return sideHustleTxs.length >= 2;
};

const isPejuangKeluarga = (user: UserData) => {
  const expenses = user.transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return false;

  const totalExpense = sumAmount(expenses);
  const familyKeywords = ['listrik', 'cicilan', 'rumah', 'bill', 'tagihan', 'kpr', 'air', 'internet'];
  
  const familyExpenses = expenses.filter(t => 
    familyKeywords.some(keyword => t.category.toLowerCase().includes(keyword))
  );
  
  const totalFamilyExpense = sumAmount(familyExpenses);
  return (totalFamilyExpense / totalExpense) > 0.5;
};

const isMenteriKeuangan = (user: UserData) => {
  if (user.budgetLimit <= 0) return false;
  const last14DaysTxs = filterTransactionsByDays(user.transactions.filter(t => t.type === 'expense'), 14);
  const expenseLast14Days = sumAmount(last14DaysTxs);
  return expenseLast14Days <= user.budgetLimit;
};

const isDisiplinNabung = (user: UserData) => {
  // Check if they have a 'saving' or 'invest' transaction in each of the last 4 weeks
  const last30DaysTxs = filterTransactionsByDays(user.transactions, 30);
  const savingTxs = last30DaysTxs.filter(t => 
    t.category.toLowerCase().includes('saving') || 
    t.category.toLowerCase().includes('tabungan') ||
    t.category.toLowerCase().includes('invest')
  );

  if (savingTxs.length < 4) return false;

  // Simple heuristic: at least 4 savings transactions in 30 days, spaced out.
  // For precise checking: ensure there's at least 1 in week 1, week 2, week 3, week 4.
  const weekBuckets = new Set();
  const now = new Date();
  
  savingTxs.forEach(t => {
    const tDate = new Date(t.date);
    const diffDays = getDaysDifference(tDate, now);
    const weekNumber = Math.floor(diffDays / 7);
    if (weekNumber < 4) weekBuckets.add(weekNumber);
  });

  return weekBuckets.size === 4;
};

const isSultanDadakan = (user: UserData) => {
  const incomes = user.transactions.filter(t => t.type === 'income');
  if (incomes.length === 0) return false;

  const avgIncome = sumAmount(incomes) / incomes.length;
  return incomes.some(t => t.amount >= (avgIncome * 1.5));
};

const isTukangJajan = (user: UserData) => {
  const expenses = user.transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return false;

  const totalExpense = sumAmount(expenses);
  const foodKeywords = ['makan', 'minum', 'food', 'jajan', 'snack', 'kopi', 'coffee', 'dining', 'resto'];
  
  const foodExpenses = expenses.filter(t => 
    foodKeywords.some(keyword => t.category.toLowerCase().includes(keyword))
  );
  
  const totalFoodExpense = sumAmount(foodExpenses);
  return (totalFoodExpense / totalExpense) > 0.3;
};

// ==========================================
// 3. MAIN FUNCTION
// ==========================================

export function getUserTitle(user: UserData): { id: string, label: string, icon: string, color: string } {
  // Default Title if nothing matches
  const defaultTitle = { id: 'newbie', label: 'Pendatang Baru', icon: '🌱', color: '#9CA3AF' };

  if (user.transactions.length === 0) return defaultTitle;

  // Check conditions in priority order
  if (isMasterNabung(user))     return { id: 'master_nabung', label: 'Master Nabung', icon: '💎', color: '#8B5CF6' }; // Purple
  if (isSuhuInvestasi(user))    return { id: 'suhu_investasi', label: 'Suhu Investasi', icon: '📈', color: '#10B981' }; // Emerald
  if (isMesinUang(user))        return { id: 'mesin_uang', label: 'Mesin Uang', icon: '🚀', color: '#F59E0B' }; // Amber
  if (isPejuangKeluarga(user))  return { id: 'pejuang_keluarga', label: 'Pejuang Keluarga', icon: '🛡️', color: '#3B82F6' }; // Blue
  if (isMenteriKeuangan(user))  return { id: 'menteri_keuangan', label: 'Menteri Keuangan', icon: '⚖️', color: '#0EA5E9' }; // Sky
  if (isDisiplinNabung(user))   return { id: 'disiplin_nabung', label: 'Disiplin Nabung', icon: '📅', color: '#22C55E' }; // Green
  if (isSultanDadakan(user))    return { id: 'sultan_dadakan', label: 'Sultan Dadakan', icon: '👑', color: '#EAB308' }; // Yellow
  if (isTukangJajan(user))      return { id: 'tukang_jajan', label: 'Tukang Jajan', icon: '🍔', color: '#EF4444' }; // Red

  return defaultTitle;
}
