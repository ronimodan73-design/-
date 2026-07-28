import React from 'react';

const ApiKeyNotice: React.FC = () => (
  <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl p-4 text-sm leading-relaxed">
    <p className="font-bold mb-1">⚠️ חסר מפתח API</p>
    <p>
      כדי שהאפליקציה תוכל לחפש ולהשוות מוצרים בזמן אמת, יש להגדיר מפתח <code dir="ltr">GEMINI_API_KEY</code> בקובץ{' '}
      <code dir="ltr">.env.local</code> ולהריץ מחדש את השרת המקומי.
    </p>
  </div>
);

export default ApiKeyNotice;
