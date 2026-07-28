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
