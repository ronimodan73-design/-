import React, { useState } from 'react';
import { EntryType, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';

interface Props {
  onAdd: (type: EntryType, amount: number, note: string, date: string, category?: ExpenseCategory) => void;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const QuickAddEntry: React.FC<Props> = ({ onAdd }) => {
  const [type, setType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('מזון');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayStr());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    onAdd(type, value, note.trim(), date, type === 'expense' ? category : undefined);
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${
            type === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          💸 הוצאה
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${
            type === 'income' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          💰 הכנסה
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="סכום בשקלים"
          required
          className="flex-1 min-w-[100px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        {type === 'expense' && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="הערה קצרה (לא חובה)"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-2 text-sm">
        הוסף/י
      </button>
    </form>
  );
};

export default QuickAddEntry;
