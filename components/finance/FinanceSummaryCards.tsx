import React from 'react';
import { MonthSummary } from '../../utils/financeCalc';
import { CATEGORY_EMOJI } from '../../constants';

interface Props {
  summary: MonthSummary;
}

const FinanceSummaryCards: React.FC<Props> = ({ summary }) => {
  const isPositive = summary.balance >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">היום הוצאתי</p>
          <p className="text-xl font-extrabold text-slate-700">{summary.todaySpent.toFixed(0)} ₪</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">הכנסות החודש</p>
          <p className="text-xl font-extrabold text-green-600">{summary.income.toFixed(0)} ₪</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">הוצאות החודש</p>
          <p className="text-xl font-extrabold text-red-500">{summary.expense.toFixed(0)} ₪</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${isPositive ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <p className="text-xs text-slate-500 mb-1">{isPositive ? '😊 יתרה חיובית' : '😟 יתרה שלילית'}</p>
          <p className={`text-xl font-extrabold ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
            {summary.balance.toFixed(0)} ₪
          </p>
        </div>
      </div>

      {summary.topCategories.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-600 mb-3">📊 איפה הכי הוצאתי החודש</p>
          <div className="space-y-2">
            {summary.topCategories.map((c) => {
              const max = summary.topCategories[0].total || 1;
              const pct = Math.max(8, Math.round((c.total / max) * 100));
              return (
                <div key={c.category} className="flex items-center gap-2 text-sm">
                  <span className="w-28 shrink-0 text-slate-600">
                    {CATEGORY_EMOJI[c.category]} {c.category}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-left font-bold text-slate-600">{c.total.toFixed(0)} ₪</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSummaryCards;
