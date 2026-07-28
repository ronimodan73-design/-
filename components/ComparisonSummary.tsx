import React, { useState } from 'react';
import { ComparisonResult } from '../types';
import { PLATFORM_INFO } from '../constants';
import PlatformCard from './PlatformCard';

interface Props {
  result: ComparisonResult;
  onSave: () => void;
  saved: boolean;
}

const ComparisonSummary: React.FC<Props> = ({ result, onSave, saved }) => {
  const [showSources, setShowSources] = useState(false);
  const bestInfo = PLATFORM_INFO[result.bestPlatform];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-l from-blue-50 to-white border border-blue-100 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              המלצה עבור: <span className="text-blue-700">{result.productQuery}</span>
            </h2>
            <p className="text-slate-600 mt-2 leading-relaxed">{result.summary}</p>
          </div>
          <button
            onClick={onSave}
            disabled={saved}
            className="whitespace-nowrap text-sm font-bold bg-white border border-blue-300 text-blue-700 rounded-xl px-4 py-2 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? 'נשמר ✓' : '💾 שמור השוואה'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          <span className="bg-white rounded-lg px-3 py-2 border border-slate-200">
            🏆 הכי משתלם: <b>{bestInfo.emoji} {bestInfo.name}</b>
          </span>
          <span className="bg-white rounded-lg px-3 py-2 border border-slate-200">
            ⏰ {result.bestTimeToBuy}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.platforms.map((p) => (
          <PlatformCard key={p.platform} data={p} />
        ))}
      </div>

      {result.sizeAdviceNote && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
          📏 <b>לגבי מידות:</b> {result.sizeAdviceNote}
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="font-bold text-slate-700 mb-2">💡 טיפים לקנייה חכמה</p>
        <ul className="space-y-1 text-sm text-slate-600 list-disc pr-5">
          {result.buyingTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {result.sources.length > 0 && (
        <div className="text-xs">
          <button onClick={() => setShowSources((s) => !s)} className="text-slate-400 hover:text-slate-600 underline">
            {showSources ? 'הסתר מקורות' : `הצג מקורות (${result.sources.length})`}
          </button>
          {showSources && (
            <ul className="mt-2 space-y-1">
              {result.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSummary;
