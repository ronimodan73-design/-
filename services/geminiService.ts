
import { GoogleGenAI } from "@google/genai";
import type { Question, Fraction } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatFraction = (f: Fraction): string => {
    if (f.denominator === 1) {
        return `${f.numerator}`;
    }
    return `${f.numerator}/${f.denominator}`;
};

export const getHint = async (question: Question): Promise<string> => {
  const questionString = `${formatFraction(question.f1)} * ${formatFraction(question.f2)}`;
  
  const prompt = `
    Provide a short, simple, and encouraging hint in Hebrew for solving the fraction multiplication problem: ${questionString}.
    The hint should guide the user on the process, but MUST NOT give the final answer or the direct result of the multiplication.
    For example, if the problem is 2/3 * 4/5, a good hint would be: 'כדי לפתור, הכפילו את המונים (המספרים למעלה) זה בזה, ואז הכפילו את המכנים (המספרים למטה) זה בזה.'.
    If the problem involves a whole number, like 5 * 1/3, a good hint would be: 'אפשר לחשוב על המספר השלם 5 כמו על השבר 5/1. עכשיו, פתרו כמו תרגיל כפל רגיל בין שני שברים.'.
    Keep the language simple and suitable for a student.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get hint from Gemini API.");
  }
};
