import React, { useState } from 'react';
import { ShoppingListItem } from '../../types';

interface Props {
  items: ShoppingListItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const ShoppingListPanel: React.FC<Props> = ({ items, onAdd, onToggle, onRemove }) => {
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="font-bold text-slate-700 mb-3">🛒 מה עליי לקנות</p>
      <form onSubmit={submit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="הוסיפי פריט לרשימה..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg px-4 text-sm">
          הוסף
        </button>
      </form>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-2">הרשימה ריקה.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 py-1">
              <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} className="w-4 h-4" />
              <span className={`flex-1 text-sm ${item.done ? 'line-through text-slate-300' : 'text-slate-700'}`}>
                {item.text}
              </span>
              <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 text-sm">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingListPanel;
