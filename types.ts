export type Platform = 'aliexpress' | 'shein' | 'temu';

export interface PlatformResult {
  platform: Platform;
  priceRangeILS: string;
  rating: number;
  reviewCount: string;
  qualityNotes: string;
  pros: string[];
  cons: string[];
  searchUrl: string;
  recommended: boolean;
}

export interface Source {
  title: string;
  uri: string;
}

export interface ComparisonResult {
  productQuery: string;
  summary: string;
  bestPlatform: Platform;
  bestTimeToBuy: string;
  buyingTips: string[];
  sizeAdviceNote: string;
  platforms: PlatformResult[];
  sources: Source[];
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  result: ComparisonResult;
}

export type SizeCategory = 'women-clothing' | 'men-clothing' | 'women-shoes' | 'men-shoes' | 'kids-clothing';

export type SizeSystem = 'IL_EU' | 'US' | 'UK' | 'ASIA' | 'CM';

export interface SizeRow {
  IL_EU: string;
  US: string;
  UK: string;
  ASIA: string;
  CM?: string;
}

export type EntryType = 'income' | 'expense';

export type ExpenseCategory =
  | 'מזון'
  | 'קניות אונליין'
  | 'חשבונות ובית'
  | 'תחבורה'
  | 'בידור ופנאי'
  | 'בריאות'
  | 'אחר';

export interface FinanceEntry {
  id: string;
  type: EntryType;
  amount: number;
  category?: ExpenseCategory;
  note: string;
  date: string;
  timestamp: number;
}

export interface ShoppingListItem {
  id: string;
  text: string;
  done: boolean;
  timestamp: number;
}

export interface ReminderItem {
  id: string;
  text: string;
  dueDate?: string;
  done: boolean;
  timestamp: number;
}

export type AdvisorVerdict = 'worth_it' | 'not_worth_it' | 'depends';

export interface AdvisorAnswer {
  verdict: AdvisorVerdict;
  verdictLabel: string;
  simpleExplanation: string;
  gain: string;
  loss: string;
  tip: string;
}

export interface AdvisorQA {
  id: string;
  question: string;
  answer: AdvisorAnswer;
  timestamp: number;
}
