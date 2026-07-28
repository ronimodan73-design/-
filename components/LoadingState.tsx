import React, { useEffect, useState } from 'react';

const MESSAGES = [
  'משווה מחירים בין אליאקספרס, שיין וטמו...',
  'קורא ביקורות אמיתיות של קונים...',
  'בודק דירוגים ואיכות...',
  'מחפש מבצעים ומועדי קנייה משתלמים...',
];

const LoadingState: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{MESSAGES[index]}</p>
    </div>
  );
};

export default LoadingState;
