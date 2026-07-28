export const extractJson = (text: string): unknown => {
  const cleaned = text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('לא נמצא JSON בתשובת המודל');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
};
