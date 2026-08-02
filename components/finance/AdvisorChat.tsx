import React, { useState } from 'react';
import { AdvisorQA, AdvisorVerdict } from '../../types';

interface Props {
  history: AdvisorQA[];
  isLoading: boolean;
  error: string;
  onAsk: (question: string) => void;
}

const VERDICT_STYLE: Record<AdvisorVerdict, { emoji: string; className: string }> = {
  worth_it: { emoji: '✅', className: 'bg-green-50 border-green-300 text-green-700' },
  not_worth_it: { emoji: '❌', className: 'bg-red-50 border-red-300 text-red-700' },
  depends: { emoji: '🤔', className: 'bg-amber-50 border-amber-300 text-amber-700' },
};

const EXAMPLES = ['כדאי לי לקנות ג׳קט ב-200 ₪?', 'האם אני מוציאה יותר מדי החודש?', 'כדאי לי לחסוך 500 ₪ בחודש?'];

const AdvisorChat: React.FC<Props> = ({ history, isLoading, error, onAsk }) => {
  const [question, setQuestion] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onAsk(trimmed);
    setQuestion('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-bold text-blue-800 mb-2">🧑‍🏫 שאל/י את היועצת הכלכלית</p>
        <p className="text-xs text-blue-600 mb-3">שאלי כל שאלה כספית - התשובה תהיה פשוטה וברורה, בלי מונחים מסובכים.</p>
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="לדוגמה: כדאי לי לקנות...?"
            disabled={isLoading}
            className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            {isLoading ? 'חושבת...' : 'שאל/י'}
          </button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={isLoading}
              onClick={() => setQuestion(ex)}
              className="text-xs bg-white hover:bg-blue-100 text-blue-600 rounded-full px-3 py-1 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="space-y-3">
        {history.map((qa) => {
          const style = VERDICT_STYLE[qa.answer.verdict];
          return (
            <div key={qa.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-slate-600">❓ {qa.question}</p>
              <div className={`rounded-lg border p-3 ${style.className}`}>
                <p className="font-extrabold">
                  {style.emoji} {qa.answer.verdictLabel}
                </p>
                <p className="text-sm mt-1">{qa.answer.simpleExplanation}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p className="bg-green-50 rounded-lg p-2 text-green-700">📈 <b>תרוויחי:</b> {qa.answer.gain}</p>
                <p className="bg-red-50 rounded-lg p-2 text-red-600">📉 <b>תפסידי/סיכון:</b> {qa.answer.loss}</p>
              </div>
              <p className="text-sm bg-slate-50 rounded-lg p-2 text-slate-600">💡 <b>עצה:</b> {qa.answer.tip}</p>
              {qa.answer.providerUsed && (
                <p className="text-xs text-slate-400">🤖 נענה על ידי: {qa.answer.providerUsed}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdvisorChat;
