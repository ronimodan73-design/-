import { SizeCategory, SizeRow } from '../types';

export const SIZE_CATEGORY_LABELS: Record<SizeCategory, string> = {
  'women-clothing': 'ביגוד נשים',
  'men-clothing': 'ביגוד גברים',
  'women-shoes': 'נעליים נשים',
  'men-shoes': 'נעליים גברים',
  'kids-clothing': 'ביגוד ילדים',
};

export const SIZE_CATEGORY_WARNING: Record<SizeCategory, string> = {
  'women-clothing': 'מידות סיניות (Asia) בדרך כלל קטנות ב-1 עד 2 מידות ממידה ישראלית/אירופאית מקבילה. מומלץ להזמין מידה אחת גדולה יותר ולבדוק טבלת מידות ספציפית לפריט בעמוד המוצר.',
  'men-clothing': 'מידות סיניות (Asia) בדרך כלל קטנות ב-1 עד 2 מידות. אצל גברים ההבדל בולט במיוחד בכתפיים ובאורך שרוול - כדאי לבדוק מדידות בס"מ בעמוד המוצר.',
  'women-shoes': 'מידות נעליים סיניות נוטות להיות צרות יותר. מומלץ למדוד את כף הרגל בס"מ ולהשוות לטבלת המידות של המוכר הספציפי.',
  'men-shoes': 'מידות נעליים סיניות נוטות להיות צרות יותר. מומלץ למדוד את כף הרגל בס"מ ולהשוות לטבלת המידות של המוכר הספציפי.',
  'kids-clothing': 'מידות ילדים סיניות לרוב מתאימות לגובה בס"מ ולא לגיל - תמיד לבדוק לפי גובה הילד/ה בעמוד המוצר.',
};

export const WOMEN_CLOTHING: SizeRow[] = [
  { IL_EU: '34', US: 'XXS / 2', UK: '6', ASIA: 'S' },
  { IL_EU: '36', US: 'XS / 4', UK: '8', ASIA: 'M' },
  { IL_EU: '38', US: 'S / 6', UK: '10', ASIA: 'L' },
  { IL_EU: '40', US: 'M / 8', UK: '12', ASIA: 'XL' },
  { IL_EU: '42', US: 'L / 10', UK: '14', ASIA: 'XXL' },
  { IL_EU: '44', US: 'XL / 12', UK: '16', ASIA: 'XXXL' },
  { IL_EU: '46', US: 'XXL / 14', UK: '18', ASIA: '4XL' },
];

export const MEN_CLOTHING: SizeRow[] = [
  { IL_EU: '44', US: 'XS', UK: 'XS', ASIA: 'S' },
  { IL_EU: '46', US: 'S', UK: 'S', ASIA: 'M' },
  { IL_EU: '48', US: 'M', UK: 'M', ASIA: 'L' },
  { IL_EU: '50', US: 'L', UK: 'L', ASIA: 'XL' },
  { IL_EU: '52', US: 'XL', UK: 'XL', ASIA: 'XXL' },
  { IL_EU: '54', US: 'XXL', UK: 'XXL', ASIA: 'XXXL' },
  { IL_EU: '56', US: 'XXXL', UK: 'XXXL', ASIA: '4XL' },
];

export const WOMEN_SHOES: SizeRow[] = [
  { IL_EU: '36', US: '5.5', UK: '3.5', ASIA: '230', CM: '23' },
  { IL_EU: '37', US: '6.5', UK: '4.5', ASIA: '235', CM: '23.5' },
  { IL_EU: '38', US: '7.5', UK: '5.5', ASIA: '240', CM: '24' },
  { IL_EU: '39', US: '8.5', UK: '6.5', ASIA: '245', CM: '24.5' },
  { IL_EU: '40', US: '9', UK: '7', ASIA: '250', CM: '25' },
  { IL_EU: '41', US: '9.5', UK: '7.5', ASIA: '255', CM: '25.5' },
  { IL_EU: '42', US: '10.5', UK: '8.5', ASIA: '260', CM: '26' },
];

export const MEN_SHOES: SizeRow[] = [
  { IL_EU: '40', US: '7', UK: '6.5', ASIA: '250', CM: '25' },
  { IL_EU: '41', US: '8', UK: '7.5', ASIA: '255', CM: '25.5' },
  { IL_EU: '42', US: '9', UK: '8.5', ASIA: '260', CM: '26' },
  { IL_EU: '43', US: '9.5', UK: '9', ASIA: '265', CM: '26.5' },
  { IL_EU: '44', US: '10.5', UK: '10', ASIA: '270', CM: '27' },
  { IL_EU: '45', US: '11.5', UK: '11', ASIA: '280', CM: '28' },
  { IL_EU: '46', US: '12', UK: '11.5', ASIA: '290', CM: '29' },
];

export const KIDS_CLOTHING: SizeRow[] = [
  { IL_EU: '92 (2 שנים)', US: '2T', UK: '2', ASIA: '90', CM: '92' },
  { IL_EU: '98 (3 שנים)', US: '3T', UK: '3', ASIA: '100', CM: '98' },
  { IL_EU: '104 (4 שנים)', US: '4', UK: '4', ASIA: '110', CM: '104' },
  { IL_EU: '116 (6 שנים)', US: '6', UK: '6', ASIA: '120', CM: '116' },
  { IL_EU: '128 (8 שנים)', US: '8', UK: '8', ASIA: '130', CM: '128' },
  { IL_EU: '140 (10 שנים)', US: '10', UK: '10', ASIA: '140', CM: '140' },
  { IL_EU: '152 (12 שנים)', US: '12', UK: '12', ASIA: '150', CM: '152' },
];

export const SIZE_TABLES: Record<SizeCategory, SizeRow[]> = {
  'women-clothing': WOMEN_CLOTHING,
  'men-clothing': MEN_CLOTHING,
  'women-shoes': WOMEN_SHOES,
  'men-shoes': MEN_SHOES,
  'kids-clothing': KIDS_CLOTHING,
};
