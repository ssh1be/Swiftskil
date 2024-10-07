// components/Quiz.tsx
// components/Quiz.tsx

"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CheckCircle, XCircle } from 'lucide-react'; // Icons for correct and incorrect answers
import clsx from 'clsx'; // For conditional classNames
import { Button } from '@/components/ui/button';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  quiz: QuizQuestion[];
}

export default function Quiz({ quiz }: QuizProps) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = quiz.reduce((acc, curr, idx) => {
    if (userAnswers[idx] === curr.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {quiz.map((q, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-semibold">{idx + 1}. {q.question}</p>
            <RadioGroupPrimitive.Root
              className="flex flex-col space-y-2 mt-2"
              value={userAnswers[idx]}
              onValueChange={(value) => handleSelect(idx, value)}
              disabled={submitted}
            >
              {q.options.map((option, optionIdx) => (
                <label key={optionIdx} htmlFor={`quiz-${idx}-option-${optionIdx}`} className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupPrimitive.Item
                    className={clsx(
                      "w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center",
                      "focus:outline-none focus:ring-2", 
                      "hover:border-blue-500"
                    )}
                    value={option}
                    id={`quiz-${idx}-option-${optionIdx}`}
                  >
                    <RadioGroupPrimitive.Indicator className="w-2 h-2 rounded-full bg-blue-500 transition-opacity duration-200 opacity-0 data-[state=checked]:opacity-100 data-[state=checked]:animate-pulse"/>
                  </RadioGroupPrimitive.Item>
                  <span>{option}</span>
                </label>
              ))}
            </RadioGroupPrimitive.Root>
            {submitted && (
              <div className="mt-2">
                {userAnswers[idx] === q.correctAnswer ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-1" />
                    Incorrect. Correct Answer: {q.correctAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={quiz.length !== Object.keys(userAnswers).length}
            className="mt-4"
          >
            Submit Answers
          </Button>
        ) : (
          <div className="mt-4">
            <p className="text-xl font-bold">Your Score: {score} / {quiz.length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
