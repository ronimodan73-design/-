import React, { useState } from 'react';
import { SizeCategory } from '../types';
import { SIZE_CATEGORY_LABELS, SIZE_CATEGORY_WARNING, SIZE_TABLES } from '../utils/sizeCharts';

const CATEGORIES = Object.keys(SIZE_CATEGORY_LABELS) as SizeCategory[];

const SizeConverter: React.FC = () => {
  const [category, setCategory] = useState<SizeCategory>('women-clothing');
  const rows = SIZE_TABLES[category];
  const hasCm = rows.some((r) => r.CM);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm font-bold rounded-full px-4 py-2 transition-colors ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {SIZE_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
        📏 {SIZE_CATEGORY_WARNING[category]}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="py-2 px-3">ישראל / אירופה</th>
              <th className="py-2 px-3">ארה"ב (US)</th>
              <th className="py-2 px-3">בריטניה (UK)</th>
              <th className="py-2 px-3">אסיה (China/AliExpress)</th>
              {hasCm && <th className="py-2 px-3">ס"מ</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="py-2 px-3 font-bold">{row.IL_EU}</td>
                <td className="py-2 px-3">{row.US}</td>
                <td className="py-2 px-3">{row.UK}</td>
                <td className="py-2 px-3">{row.ASIA}</td>
                {hasCm && <td className="py-2 px-3">{row.CM ?? '-'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeConverter;
