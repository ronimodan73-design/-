import React from 'react';

const ApiKeyNotice: React.FC = () => (
  <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl p-4 text-sm leading-relaxed">
    <p className="font-bold mb-1">⚠️ לא מוגדר אף מפתח API</p>
    <p>
      האפליקציה עובדת עם Model Router שמנסה כמה ספקי AI לפי סדר עדיפות: קודם{' '}
      <code dir="ltr">OPENAI_API_KEY</code> (Codex), אחר כך <code dir="ltr">MOONSHOT_API_KEY</code> (Kimi K2),
      ולבסוף <code dir="ltr">GEMINIAPIKEY</code> (Gemini). מספיק להגדיר מפתח אחד מהם בקובץ{' '}
      <code dir="ltr">.env.local</code> ולהריץ מחדש את השרת המקומי - אם יוגדרו כמה מפתחות, האפליקציה תעבור אוטומטית
      לספק הבא אם הראשון לא זמין או שהמכסה שלו נגמרה.
    </p>
  </div>
);

export default ApiKeyNotice;
