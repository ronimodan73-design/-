import { FinanceEntry, ExpenseCategory } from '../types';

const todayStr = (): string => new Date().toISOString().slice(0, 10);
const monthKey = (date: string): string => date.slice(0, 7);

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
  todaySpent: number;
  topCategories: { category: ExpenseCategory; total: number }[];
}

export const summarizeMonth = (entries: FinanceEntry[]): MonthSummary => {
  const thisMonth = monthKey(todayStr());
  const monthEntries = entries.filter((e) => monthKey(e.date) === thisMonth);

  const income = monthEntries.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = monthEntries.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);

  const todaySpent = entries
    .filter((e) => e.type === 'expense' && e.date === todayStr())
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = new Map<ExpenseCategory, number>();
  monthEntries
    .filter((e) => e.type === 'expense' && e.category)
    .forEach((e) => {
      categoryTotals.set(e.category as ExpenseCategory, (categoryTotals.get(e.category as ExpenseCategory) ?? 0) + e.amount);
    });

  const topCategories = Array.from(categoryTotals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return { income, expense, balance: income - expense, todaySpent, topCategories };
};

export const buildFinanceContext = (entries: FinanceEntry[]): string => {
  const summary = summarizeMonth(entries);

  if (entries.length === 0) {
    return 'המשתמשת עדיין לא הזינה נתונים פיננסיים כלשהם (אין הכנסות או הוצאות רשומות).';
  }

  const categoryLines = summary.topCategories.length
    ? summary.topCategories.map((c) => `- ${c.category}: ${c.total.toFixed(0)} ₪`).join('\n')
    : '- אין נתוני קטגוריות החודש';

  return `
הכנסות החודש: ${summary.income.toFixed(0)} ₪
הוצאות החודש: ${summary.expense.toFixed(0)} ₪
יתרה (הכנסות פחות הוצאות) החודש: ${summary.balance.toFixed(0)} ₪
הוצאות היום: ${summary.todaySpent.toFixed(0)} ₪
הקטגוריות שהכי הוציאה עליהן החודש:
${categoryLines}
`.trim();
};
