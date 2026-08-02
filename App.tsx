import React, { useEffect, useState } from 'react';
import { ComparisonResult, HistoryItem, FinanceEntry, ShoppingListItem, ReminderItem, AdvisorQA } from './types';
import { compareProduct, hasApiKey, MissingApiKeyError, askAdvisor } from './services/aiService';
import { loadHistory, saveToHistory, removeFromHistory } from './utils/storage';
import {
  loadFinanceEntries,
  addFinanceEntry,
  removeFinanceEntry,
  loadShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  removeShoppingItem,
  loadReminders,
  addReminder,
  toggleReminder,
  removeReminder,
  loadAdvisorHistory,
  addAdvisorHistory,
} from './utils/financeStorage';
import { summarizeMonth, buildFinanceContext } from './utils/financeCalc';
import SearchBar from './components/SearchBar';
import LoadingState from './components/LoadingState';
import ComparisonSummary from './components/ComparisonSummary';
import SizeConverter from './components/SizeConverter';
import HistoryPanel from './components/HistoryPanel';
import SaleCalendar from './components/SaleCalendar';
import ApiKeyNotice from './components/ApiKeyNotice';
import FinanceSummaryCards from './components/finance/FinanceSummaryCards';
import QuickAddEntry from './components/finance/QuickAddEntry';
import EntriesList from './components/finance/EntriesList';
import ShoppingListPanel from './components/finance/ShoppingListPanel';
import RemindersPanel from './components/finance/RemindersPanel';
import AdvisorChat from './components/finance/AdvisorChat';

type Tab = 'compare' | 'sizes' | 'calendar' | 'history' | 'finance';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'compare', label: 'השוואת מחירים', emoji: '🔍' },
  { id: 'sizes', label: 'המרת מידות', emoji: '📏' },
  { id: 'calendar', label: 'לוח מבצעים', emoji: '🗓️' },
  { id: 'finance', label: 'יועץ כלכלי', emoji: '💰' },
  { id: 'history', label: 'שמורים שלי', emoji: '💾' },
];

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('compare');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [advisorHistory, setAdvisorHistory] = useState<AdvisorQA[]>([]);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState('');

  useEffect(() => {
    setHistory(loadHistory());
    setFinanceEntries(loadFinanceEntries());
    setShoppingList(loadShoppingList());
    setReminders(loadReminders());
    setAdvisorHistory(loadAdvisorHistory());
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

  const handleAddFinanceEntry = (
    type: FinanceEntry['type'],
    amount: number,
    note: string,
    date: string,
    category?: FinanceEntry['category']
  ) => {
    setFinanceEntries(addFinanceEntry(type, amount, note, date, category));
  };

  const handleRemoveFinanceEntry = (id: string) => {
    setFinanceEntries(removeFinanceEntry(id));
  };

  const handleAddShoppingItem = (text: string) => setShoppingList(addShoppingItem(text));
  const handleToggleShoppingItem = (id: string) => setShoppingList(toggleShoppingItem(id));
  const handleRemoveShoppingItem = (id: string) => setShoppingList(removeShoppingItem(id));

  const handleAddReminder = (text: string, dueDate?: string) => setReminders(addReminder(text, dueDate));
  const handleToggleReminder = (id: string) => setReminders(toggleReminder(id));
  const handleRemoveReminder = (id: string) => setReminders(removeReminder(id));

  const handleAskAdvisor = async (question: string) => {
    setAdvisorLoading(true);
    setAdvisorError('');
    try {
      const context = buildFinanceContext(financeEntries);
      const answer = await askAdvisor(question, context);
      const qa: AdvisorQA = { id: `${Date.now()}`, question, answer, timestamp: Date.now() };
      setAdvisorHistory(addAdvisorHistory(qa));
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        setAdvisorError('missing-key');
      } else {
        console.error(err);
        setAdvisorError('אירעה שגיאה בזמן קבלת התשובה. נסה/י שוב בעוד רגע.');
      }
    } finally {
      setAdvisorLoading(false);
    }
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

        {tab === 'finance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">💰 יועץ כלכלי אישי</h2>
              <p className="text-sm text-slate-500 mb-4">
                עקבי אחרי ההכנסות וההוצאות שלך, ותקבלי המלצות פשוטות וברורות לכל שאלה כספית.
              </p>
            </div>

            {!hasApiKey() && <ApiKeyNotice />}

            <FinanceSummaryCards summary={summarizeMonth(financeEntries)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAddEntry onAdd={handleAddFinanceEntry} />
              <EntriesList entries={financeEntries} onRemove={handleRemoveFinanceEntry} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ShoppingListPanel
                items={shoppingList}
                onAdd={handleAddShoppingItem}
                onToggle={handleToggleShoppingItem}
                onRemove={handleRemoveShoppingItem}
              />
              <RemindersPanel
                items={reminders}
                onAdd={handleAddReminder}
                onToggle={handleToggleReminder}
                onRemove={handleRemoveReminder}
              />
            </div>

            <AdvisorChat
              history={advisorHistory}
              isLoading={advisorLoading}
              error={advisorError === 'missing-key' ? '' : advisorError}
              onAsk={handleAskAdvisor}
            />
            {advisorError === 'missing-key' && <ApiKeyNotice />}
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
