
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Fraction } from './types';
import { generateQuestions, areFractionsEqual } from './utils/fractionUtils';
import { getHint } from './services/geminiService';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerInput from './components/AnswerInput';
import FeedbackDisplay from './components/FeedbackDisplay';
import ProgressBar from './components/ProgressBar';
import BigIdeaModal from './components/BigIdeaModal';
import { TOTAL_QUESTIONS } from './constants';

const App: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<{ numerator: string; denominator: string }>({ numerator: '', denominator: '' });
    const [feedback, setFeedback] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [hint, setHint] = useState<string>('');
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [showBigIdea, setShowBigIdea] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    useEffect(() => {
        setQuestions(generateQuestions());
    }, []);

    const resetForNextQuestion = () => {
        setUserAnswer({ numerator: '', denominator: '' });
        setFeedback('');
        setHint('');
        setIsCorrect(null);
    };

    const handleCheckAnswer = () => {
        if (!userAnswer.numerator || !userAnswer.denominator) {
            setFeedback('נא למלא גם מונה וגם מכנה.');
            setIsCorrect(false);
            return;
        }

        const userAnswerFraction: Fraction = {
            numerator: parseInt(userAnswer.numerator),
            denominator: parseInt(userAnswer.denominator),
        };

        const currentQuestion = questions[currentQuestionIndex];
        if (areFractionsEqual(userAnswerFraction, currentQuestion.answer)) {
            setFeedback('כל הכבוד! תשובה נכונה!');
            setIsCorrect(true);
            if (isCorrect === null) {
              setScore(s => s + 1);
            }
        } else {
            setFeedback('תשובה לא נכונה. נסו שוב!');
            setIsCorrect(false);
        }
    };
    
    const handleNextQuestion = () => {
        if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetForNextQuestion();
        } else {
            setIsQuizFinished(true);
        }

        if (currentQuestionIndex === 4 || currentQuestionIndex === 14) {
            setShowBigIdea(true);
        }
    };
    
    const handleGetHint = useCallback(async () => {
        if (questions.length === 0) return;
        setIsHintLoading(true);
        setHint('');
        try {
            const question = questions[currentQuestionIndex];
            const hintText = await getHint(question);
            setHint(hintText);
        } catch (error) {
            console.error("Error fetching hint:", error);
            setHint('מצטערים, לא הצלחנו להביא רמז כרגע.');
        } finally {
            setIsHintLoading(false);
        }
    }, [currentQuestionIndex, questions]);
    
    const restartQuiz = () => {
        setQuestions(generateQuestions());
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizFinished(false);
        resetForNextQuestion();
    };

    if (questions.length === 0) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-xl">טוען שאלות...</div></div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all">
                {isQuizFinished ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-blue-600 mb-4">התרגול הסתיים!</h2>
                        <p className="text-xl mb-6">הציון הסופי שלך: <span className="font-bold text-green-500">{score}</span> מתוך {TOTAL_QUESTIONS}</p>
                        <button 
                            onClick={restartQuiz} 
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                        >
                            התחל תרגול חדש
                        </button>
                    </div>
                ) : (
                    <>
                        <header className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700">כפל שברים פשוטים</h1>
                            <ProgressBar current={currentQuestionIndex + 1} total={TOTAL_QUESTIONS} />
                            <p className="text-center text-lg mt-2">ציון: {score}</p>
                        </header>
                        
                        <main className="space-y-6">
                            <QuestionDisplay question={currentQuestion} questionNumber={currentQuestionIndex + 1} />
                            <AnswerInput userAnswer={userAnswer} setUserAnswer={setUserAnswer} disabled={isCorrect === true} />
                            <FeedbackDisplay feedback={feedback} isCorrect={isCorrect} />
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={handleCheckAnswer}
                                    disabled={isCorrect === true}
                                    className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-transform transform hover:scale-105"
                                >
                                    בדיקת תשובה
                                </button>
                                <button 
                                    onClick={handleGetHint}
                                    disabled={isCorrect === true}
                                    className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 transition-transform transform hover:scale-105"
                                >
                                    {isHintLoading ? 'חושב...' : 'קבל רמז'}
                                </button>
                                {isCorrect && (
                                    <button 
                                        onClick={handleNextQuestion}
                                        className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 animate-pulse"
                                    >
                                        השאלה הבאה
                                    </button>
                                )}
                            </div>
                            
                            {hint && <p className="text-center bg-yellow-100 border-r-4 border-yellow-500 text-yellow-700 p-4 rounded-md mt-4">{hint}</p>}
                        </main>
                    </>
                )}
            </div>
            {showBigIdea && <BigIdeaModal onClose={() => setShowBigIdea(false)} />}
        </div>
    );
};

export default App;
