import { HistoryItem, ComparisonResult } from '../types';
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from '../constants';

export const loadHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (query: string, result: ComparisonResult): HistoryItem[] => {
  const history = loadHistory();
  const item: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query,
    timestamp: Date.now(),
    result,
  };
  const updated = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const removeFromHistory = (id: string): HistoryItem[] => {
  const updated = loadHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};
