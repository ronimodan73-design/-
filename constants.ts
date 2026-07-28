import { Platform, ExpenseCategory } from './types';

export const PLATFORM_INFO: Record<Platform, { name: string; color: string; emoji: string; searchUrlTemplate: (q: string) => string }> = {
  aliexpress: {
    name: 'AliExpress',
    color: '#e62e04',
    emoji: '🛍️',
    searchUrlTemplate: (q) => `https://he.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}`,
  },
  shein: {
    name: 'Shein',
    color: '#000000',
    emoji: '👗',
    searchUrlTemplate: (q) => `https://il.shein.com/pdsearch/${encodeURIComponent(q)}/`,
  },
  temu: {
    name: 'Temu',
    color: '#fb7701',
    emoji: '📦',
    searchUrlTemplate: (q) => `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(q)}`,
  },
};

export const SALE_CALENDAR: { title: string; dateHint: string; note: string }[] = [
  { title: '11.11 - יום הרווקים', dateHint: 'נובמבר', note: 'המבצע הגדול בשנה באליאקספרס, הנחות עמוקות וקופונים גלובליים.' },
  { title: '6.18', dateHint: 'יוני', note: 'מבצע אמצע שנה גדול באליאקספרס ובפלטפורמות סיניות נוספות.' },
  { title: 'בלאק פריידי / סייבר מאנדיי', dateHint: 'סוף נובמבר', note: 'הנחות רוחביות בכל שלוש הפלטפורמות, כולל טמו ו-Shein.' },
  { title: 'מבצעי פתיחת עונה', dateHint: 'תחילת כל עונה', note: 'Shein מוציאה קולקציות והנחות בתחילת כל עונת אופנה.' },
  { title: 'קופוני משתמש חדש', dateHint: 'כל השנה', note: 'טמו ו-Shein מציעות הנחות גבוהות מאוד לנרשמים חדשים - שווה לבדוק לפני כל הזמנה ראשונה.' },
];

export const HISTORY_STORAGE_KEY = 'smart-shopping-history-v1';
export const MAX_HISTORY_ITEMS = 30;

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'מזון',
  'קניות אונליין',
  'חשבונות ובית',
  'תחבורה',
  'בידור ופנאי',
  'בריאות',
  'אחר',
];

export const CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  'מזון': '🍎',
  'קניות אונליין': '🛍️',
  'חשבונות ובית': '🏠',
  'תחבורה': '🚌',
  'בידור ופנאי': '🎮',
  'בריאות': '💊',
  'אחר': '📎',
};

export const FINANCE_ENTRIES_KEY = 'smart-finance-entries-v1';
export const SHOPPING_LIST_KEY = 'smart-finance-shopping-list-v1';
export const REMINDERS_KEY = 'smart-finance-reminders-v1';
export const ADVISOR_HISTORY_KEY = 'smart-finance-advisor-history-v1';
export const MAX_ADVISOR_HISTORY = 20;
