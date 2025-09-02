
export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface Question {
  f1: Fraction;
  f2: Fraction;
  answer: Fraction;
}
