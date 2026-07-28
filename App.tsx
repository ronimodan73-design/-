import React, { useEffect, useState } from 'react';
import { ComparisonResult, HistoryItem } from './types';
import { compareProduct, hasApiKey, MissingApiKeyError } from './services/geminiService';
import { loadHistory, saveToHistory, removeFromHistory } from './utils/storage';
import SearchBar from './components/SearchBar';
import LoadingState from './components/LoadingState';
import ComparisonSummary from './components/ComparisonSummary';
import SizeConverter from './components/SizeConverter';
import HistoryPanel from './components/HistoryPanel';
import SaleCalendar from './components/SaleCalendar';
import ApiKeyNotice from './components/ApiKeyNotice';

type Tab = 'compare' | 'sizes' | 'calendar' | 'history';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'compare', label: 'השוואת מחירים', emoji: '🔍' },
  { id: 'sizes', label: 'המרת מידות', emoji: '📏' },
  { id: 'calendar', label: 'לוח מבצעים', emoji: '🗓️' },
  { id: 'history', label: 'שמורים שלי', emoji: '💾' },
];

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('compare');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const comparison = await compareProduct(query);
      setResult(comparison);
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        setError('missing-key');
      } else {
        console.error(err);
        setError('אירעה שגיאה בזמן החיפוש. נסה/י שוב בעוד רגע.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const updated = saveToHistory(result.productQuery, result);
    setHistory(updated);
    setSaved(true);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setSaved(true);
    setError('');
    setTab('compare');
  };

  const handleRemoveHistory = (id: string) => {
    setHistory(removeFromHistory(id));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-extrabold text-blue-700">🛒 קניה חכמה</h1>
          <p className="text-sm text-slate-500 mt-1">
            השוואת מחירים, איכות ודירוגים בין AliExpress, Shein ו-Temu - כדי לקנות בזמן הנכון ובמקום הנכון.
          </p>
        </div>
        <nav className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap text-sm font-bold rounded-lg px-4 py-2 transition-colors ${
                tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'compare' && (
          <div className="space-y-6">
            {!hasApiKey() && <ApiKeyNotice />}
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {isLoading && <LoadingState />}

            {error === 'missing-key' && !isLoading && <ApiKeyNotice />}
            {error && error !== 'missing-key' && !isLoading && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
            )}

            {!isLoading && result && <ComparisonSummary result={result} onSave={handleSave} saved={saved} />}

            {!isLoading && !result && !error && (
              <div className="text-center text-slate-400 py-16">
                <p className="text-4xl mb-3">🔎</p>
                <p>הקלד/י שם מוצר למעלה כדי לקבל השוואת מחירים, איכות ודירוגים בין שלוש הפלטפורמות.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'sizes' && (
          <div>
            <h2 className="text-xl font-bold mb-4">📏 טבלת המרת מידות</h2>
            <SizeConverter />
          </div>
        )}

        {tab === 'calendar' && (
          <div>
            <h2 className="text-xl font-bold mb-4">🗓️ מתי הכי כדאי לקנות</h2>
            <SaleCalendar />
          </div>
        )}

        {tab === 'history' && (
          <div>
            <h2 className="text-xl font-bold mb-4">💾 השוואות שמורות</h2>
            <HistoryPanel history={history} onSelect={handleSelectHistory} onRemove={handleRemoveHistory} />
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 pb-8 text-center text-xs text-slate-400">
        המידע מבוסס על חיפוש אינטרנטי בזמן אמת ואינו מהווה תחליף לבדיקה עצמאית לפני רכישה.
      </footer>
    </div>
  );
};

export default App;
