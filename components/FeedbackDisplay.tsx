
import React from 'react';

interface FeedbackDisplayProps {
  feedback: string;
  isCorrect: boolean | null;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isCorrect }) => {
  if (!feedback) return null;

  const baseClasses = "p-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2";
  const successClasses = "bg-green-100 text-green-700";
  const errorClasses = "bg-red-100 text-red-700";

  const icon = isCorrect ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className={`${baseClasses} ${isCorrect ? successClasses : errorClasses}`}>
        {icon}
        <span>{feedback}</span>
    </div>
  );
};

export default FeedbackDisplay;
