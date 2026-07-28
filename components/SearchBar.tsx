import React, { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLES = ['אוזניות בלוטות׳ אלחוטיות', 'מעיל חורף לנשים', 'שעון חכם', 'תיק גב לבית ספר'];

const SearchBar: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="איזה מוצר את/ה רוצה לבדוק? לדוגמה: אוזניות בלוטות'"
          disabled={isLoading}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
        >
          {isLoading ? 'בודק...' : 'השווה מחירים'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={isLoading}
            onClick={() => setValue(ex)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full px-3 py-1 transition-colors disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  );
};

export default SearchBar;
