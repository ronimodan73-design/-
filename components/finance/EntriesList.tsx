import React from 'react';
import { FinanceEntry } from '../../types';
import { CATEGORY_EMOJI } from '../../constants';

interface Props {
  entries: FinanceEntry[];
  onRemove: (id: string) => void;
}

const EntriesList: React.FC<Props> = ({ entries, onRemove }) => {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-6">עדיין לא הזנת הכנסות או הוצאות.</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.slice(0, 15).map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{e.type === 'income' ? '💰' : e.category ? CATEGORY_EMOJI[e.category] : '💸'}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{e.note || (e.type === 'income' ? 'הכנסה' : e.category)}</p>
              <p className="text-xs text-slate-400">{e.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`font-bold ${e.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
              {e.type === 'income' ? '+' : '-'}
              {e.amount.toFixed(0)} ₪
            </span>
            <button onClick={() => onRemove(e.id)} className="text-slate-300 hover:text-red-500" aria-label="מחק">
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EntriesList;
