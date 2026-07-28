import React from 'react';
import { PlatformResult } from '../types';
import { PLATFORM_INFO } from '../constants';

interface Props {
  data: PlatformResult;
}

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="text-amber-500 text-sm" aria-label={`דירוג ${rating} מתוך 5`}>
      {'★'.repeat(Math.floor(rounded))}
      {rounded % 1 !== 0 ? '½' : ''}
      {'☆'.repeat(5 - Math.ceil(rounded))}
      <span className="text-slate-500 ms-1">{rating.toFixed(1)}</span>
    </span>
  );
};

const PlatformCard: React.FC<Props> = ({ data }) => {
  const info = PLATFORM_INFO[data.platform];

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border p-4 bg-white shadow-sm transition-transform hover:-translate-y-0.5 ${
        data.recommended ? 'border-green-400 ring-2 ring-green-200' : 'border-slate-200'
      }`}
    >
      {data.recommended && (
        <span className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          המומלץ ביותר ✓
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{info.emoji}</span>
          <span className="font-bold text-lg">{info.name}</span>
        </div>
        <Stars rating={data.rating} />
      </div>

      <div className="text-2xl font-extrabold text-slate-800">{data.priceRangeILS}</div>
      <div className="text-xs text-slate-500">{data.reviewCount} ביקורות (הערכה)</div>

      <p className="text-sm text-slate-600 leading-relaxed">{data.qualityNotes}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="font-bold text-green-600 mb-1">יתרונות</p>
          <ul className="space-y-1">
            {data.pros.map((p, i) => (
              <li key={i} className="text-slate-600">+ {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-red-500 mb-1">חסרונות</p>
          <ul className="space-y-1">
            {data.cons.map((c, i) => (
              <li key={i} className="text-slate-600">- {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={data.searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-center text-sm font-bold rounded-xl py-2 text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: info.color }}
      >
        חיפוש ב-{info.name} ↗
      </a>
    </div>
  );
};

export default PlatformCard;
