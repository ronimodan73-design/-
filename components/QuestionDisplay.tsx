
import React from 'react';
import { Question, Fraction } from '../types';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
}

const FractionView: React.FC<{ fraction: Fraction }> = ({ fraction }) => {
    if (fraction.denominator === 1) {
        return <span className="text-4xl font-bold mx-2">{fraction.numerator}</span>;
    }
    return (
        <div className="inline-flex flex-col items-center mx-2 leading-none">
            <span className="text-3xl font-semibold">{fraction.numerator}</span>
            <span className="border-t-2 border-slate-800 w-12 my-1"></span>
            <span className="text-3xl font-semibold">{fraction.denominator}</span>
        </div>
    );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, questionNumber }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 text-center shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-gray-600">שאלה {questionNumber}</h2>
      <div className="flex items-center justify-center text-4xl font-bold text-slate-800">
        <FractionView fraction={question.f1} />
        <span className="mx-4 text-gray-500">×</span>
        <FractionView fraction={question.f2} />
        <span className="mx-4 text-gray-500">=</span>
        <span className="text-5xl text-blue-700">?</span>
      </div>
    </div>
  );
};

export default QuestionDisplay;
