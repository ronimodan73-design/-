import React from 'react';
import { HistoryItem } from '../types';
import { PLATFORM_INFO } from '../constants';

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
}

const HistoryPanel: React.FC<Props> = ({ history, onSelect, onRemove }) => {
  if (history.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-6">עדיין לא שמרת השוואות מחירים.</p>;
  }

  return (
    <ul className="space-y-2">
      {history.map((item) => {
        const bestInfo = PLATFORM_INFO[item.result.bestPlatform];
        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 transition-colors cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="min-w-0">
              <p className="font-bold text-slate-700 truncate">{item.query}</p>
              <p className="text-xs text-slate-400">
                {bestInfo.emoji} {bestInfo.name} · {new Date(item.timestamp).toLocaleDateString('he-IL')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="text-slate-300 hover:text-red-500 text-lg leading-none px-2"
              aria-label="מחק"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default HistoryPanel;
