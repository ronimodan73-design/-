
import React from 'react';

interface AnswerInputProps {
  userAnswer: { numerator: string; denominator: string };
  setUserAnswer: React.Dispatch<React.SetStateAction<{ numerator: string; denominator: string }>>;
  disabled: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ userAnswer, setUserAnswer, disabled }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setUserAnswer(prev => ({ ...prev, [name]: value }));
        }
    };
    
    return (
        <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center leading-none">
                <input
                    type="text"
                    name="numerator"
                    value={userAnswer.numerator}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-20 p-2 text-center text-2xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    placeholder="מונה"
                    aria-label="Numerator input"
                />
                <span className="border-t-2 border-slate-800 w-24 my-2"></span>
                <input
                    type="text"
                    name="denominator"
                    value={userAnswer.denominator}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-20 p-2 text-center text-2xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
                    placeholder="מכנה"
                    aria-label="Denominator input"
                />
            </div>
        </div>
    );
};

export default AnswerInput;
