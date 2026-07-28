import { FinanceEntry, ShoppingListItem, ReminderItem, AdvisorQA, EntryType, ExpenseCategory } from '../types';
import {
  FINANCE_ENTRIES_KEY,
  SHOPPING_LIST_KEY,
  REMINDERS_KEY,
  ADVISOR_HISTORY_KEY,
  MAX_ADVISOR_HISTORY,
} from '../constants';

const load = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const save = <T,>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

const makeId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Finance entries (income/expense)
export const loadFinanceEntries = (): FinanceEntry[] => load<FinanceEntry>(FINANCE_ENTRIES_KEY);

export const addFinanceEntry = (
  type: EntryType,
  amount: number,
  note: string,
  date: string,
  category?: ExpenseCategory
): FinanceEntry[] => {
  const entries = loadFinanceEntries();
  const entry: FinanceEntry = { id: makeId(), type, amount, category, note, date, timestamp: Date.now() };
  const updated = [entry, ...entries];
  save(FINANCE_ENTRIES_KEY, updated);
  return updated;
};

export const removeFinanceEntry = (id: string): FinanceEntry[] => {
  const updated = loadFinanceEntries().filter((e) => e.id !== id);
  save(FINANCE_ENTRIES_KEY, updated);
  return updated;
};

// Shopping list
export const loadShoppingList = (): ShoppingListItem[] => load<ShoppingListItem>(SHOPPING_LIST_KEY);

export const addShoppingItem = (text: string): ShoppingListItem[] => {
  const items = loadShoppingList();
  const item: ShoppingListItem = { id: makeId(), text, done: false, timestamp: Date.now() };
  const updated = [item, ...items];
  save(SHOPPING_LIST_KEY, updated);
  return updated;
};

export const toggleShoppingItem = (id: string): ShoppingListItem[] => {
  const updated = loadShoppingList().map((i) => (i.id === id ? { ...i, done: !i.done } : i));
  save(SHOPPING_LIST_KEY, updated);
  return updated;
};

export const removeShoppingItem = (id: string): ShoppingListItem[] => {
  const updated = loadShoppingList().filter((i) => i.id !== id);
  save(SHOPPING_LIST_KEY, updated);
  return updated;
};

// Reminders
export const loadReminders = (): ReminderItem[] => load<ReminderItem>(REMINDERS_KEY);

export const addReminder = (text: string, dueDate?: string): ReminderItem[] => {
  const items = loadReminders();
  const item: ReminderItem = { id: makeId(), text, dueDate, done: false, timestamp: Date.now() };
  const updated = [item, ...items];
  save(REMINDERS_KEY, updated);
  return updated;
};

export const toggleReminder = (id: string): ReminderItem[] => {
  const updated = loadReminders().map((r) => (r.id === id ? { ...r, done: !r.done } : r));
  save(REMINDERS_KEY, updated);
  return updated;
};

export const removeReminder = (id: string): ReminderItem[] => {
  const updated = loadReminders().filter((r) => r.id !== id);
  save(REMINDERS_KEY, updated);
  return updated;
};

// Advisor Q&A history
export const loadAdvisorHistory = (): AdvisorQA[] => load<AdvisorQA>(ADVISOR_HISTORY_KEY);

export const addAdvisorHistory = (item: AdvisorQA): AdvisorQA[] => {
  const updated = [item, ...loadAdvisorHistory()].slice(0, MAX_ADVISOR_HISTORY);
  save(ADVISOR_HISTORY_KEY, updated);
  return updated;
};
