
import { Fraction, Question } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

// Greatest Common Divisor using Euclidean algorithm
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Simplify a fraction
const simplify = (f: Fraction): Fraction => {
  const commonDivisor = gcd(f.numerator, f.denominator);
  return {
    numerator: f.numerator / commonDivisor,
    denominator: f.denominator / commonDivisor,
  };
};

// Multiply two fractions
const multiply = (f1: Fraction, f2: Fraction): Fraction => {
  return {
    numerator: f1.numerator * f2.numerator,
    denominator: f1.denominator * f2.denominator,
  };
};

export const areFractionsEqual = (f1: Fraction, f2: Fraction): boolean => {
    const simplifiedF1 = simplify(f1);
    const simplifiedF2 = simplify(f2);
    return simplifiedF1.numerator === simplifiedF2.numerator && simplifiedF1.denominator === simplifiedF2.denominator;
};

// --- Question Generation ---

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createRandomFraction = (): Fraction => {
    const denominator = getRandomInt(2, 10);
    const numerator = getRandomInt(1, denominator - 1);
    return { numerator, denominator };
};

const createWholeNumberAsFraction = (): Fraction => {
    return { numerator: getRandomInt(2, 10), denominator: 1 };
};

export const generateQuestions = (): Question[] => {
    const questions: Question[] = [];
    const questionTypes = ['fractionXfraction', 'wholeXfraction', 'fractionXwhole'];

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const typeIndex = i % questionTypes.length;
        let q: Question;
        let f1: Fraction, f2: Fraction;

        switch (questionTypes[typeIndex]) {
            case 'wholeXfraction':
                f1 = createWholeNumberAsFraction();
                f2 = createRandomFraction();
                break;
            case 'fractionXwhole':
                f1 = createRandomFraction();
                f2 = createWholeNumberAsFraction();
                break;
            case 'fractionXfraction':
            default:
                f1 = createRandomFraction();
                f2 = createRandomFraction();
                break;
        }

        // Randomly swap to vary position
        if (Math.random() > 0.5) {
            [f1, f2] = [f2, f1];
        }

        const answer = multiply(f1, f2);
        q = { f1, f2, answer };
        questions.push(q);
    }
    
    // Shuffle the array to randomize question order
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
};
