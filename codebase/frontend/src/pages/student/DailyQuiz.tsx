import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface QuestionHistoryItem {
  id: string;
  category: string;
  date: string;
  status: 'missed' | 'incorrect' | 'correct';
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  explanation: string;
}

export const DailyQuiz: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('This week');

  const historyItems: QuestionHistoryItem[] = [
    {
      id: 'q1',
      category: 'Logical Reasoning',
      date: '01/10/2026',
      status: 'missed',
      question: 'A cube has a total surface area of 150 cm². What is its volume?',
      correctAnswer: '125 cm³',
      explanation:
        'Total surface area = 6a² = 150 → a² = 25 → a = 5 cm. Volume = a³ = 125 cm³. Shortcut: Divide the surface area by 6 to get one face, take the square root for the side, then cube it. Trap: 25 is the area of one face, not the volume.',
    },
    {
      id: 'q2',
      category: 'Logical Reasoning',
      date: '30/09/2026',
      status: 'incorrect',
      question: 'Two fair coins are tossed. What is the probability of getting at least one head?',
      userAnswer: '1/2',
      correctAnswer: '3/4',
      explanation:
        'Outcomes: HH, HT, TH, TT. Only TT has no head, so P = 1 – 1/4 = 3/4. Shortcut: For \'at least one\', use 1 – P(none). Trap: 1/2 comes from counting \'exactly one head\' or assuming there are only three outcomes.',
    },
    {
      id: 'q3',
      category: 'Logical Reasoning',
      date: '29/09/2026',
      status: 'missed',
      question: 'A can finish a job in 12 days and B in 18 days. How long will they take working together?',
      correctAnswer: '7.2 days',
      explanation:
        'A does 1/12 of the job per day and B does 1/18. Together: 1/12 + 1/18 = 5/36 per day, so time = 36/5 = 7.2 days. Shortcut: For two workers, time together = ab/(a + b) = (12 x 18)/(12 + 18) = 216/30 = 7.2 days. Trap: Averaging the days (15) or halving the average (7.5) is wrong. Add rates, not times.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-black dark:text-white pb-12">
      
      {/* 3 TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Stat 1: ACTIVITY STREAK */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            ACTIVITY STREAK
          </p>
          <p className="text-3xl font-black text-black dark:text-white tracking-tight">
            1 days
          </p>
          <p className="text-xs font-bold text-neutral-400">
            Weekly challenges + daily quiz
          </p>
        </div>

        {/* Stat 2: ANSWERED */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            ANSWERED
          </p>
          <p className="text-3xl font-black text-black dark:text-white tracking-tight">
            1 / 6
          </p>
          <p className="text-xs font-bold text-neutral-400">
            Scheduled this week
          </p>
        </div>

        {/* Stat 3: ACCURACY */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            ACCURACY
          </p>
          <p className="text-3xl font-black text-black dark:text-white tracking-tight">
            0%
          </p>
          <p className="text-xs font-bold text-neutral-400">
            0 correct
          </p>
        </div>

      </div>

      {/* NOTICE BANNER */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-xs border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-black dark:text-white">
        Today's question is still open. Answer it on your Home page to keep the streak going.
      </div>

      {/* FILTER BAR: < THIS WEEK > */}
      <div className="flex items-center justify-between px-2 text-xs font-black text-neutral-600 dark:text-neutral-400">
        <button className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm text-neutral-700 dark:text-neutral-300">{selectedWeek}</span>
        <button className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* QUESTION HISTORY CARDS */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 space-y-4"
          >
            {/* Top Row: Category tag, date, badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-neutral-400">
                  {item.date}
                </span>
              </div>

              <div>
                {item.status === 'missed' && (
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xs">
                    Missed
                  </span>
                )}
                {item.status === 'incorrect' && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 font-bold text-xs">
                    Incorrect
                  </span>
                )}
                {item.status === 'correct' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold text-xs">
                    Correct
                  </span>
                )}
              </div>
            </div>

            {/* Question Heading */}
            <h3 className="text-base font-bold text-black dark:text-white leading-snug">
              {item.question}
            </h3>

            {/* Result Status */}
            {item.status === 'missed' && (
              <p className="text-xs font-bold text-black dark:text-white">
                Not answered on the day, so it stayed locked. Answer: <span className="font-extrabold">{item.correctAnswer}</span>
              </p>
            )}

            {item.status === 'incorrect' && (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
                  <X className="w-3.5 h-3.5" />
                  <span>{item.userAnswer} – your answer</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>{item.correctAnswer}</span>
                </div>
              </div>
            )}

            {/* Dotted Separator */}
            <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-3" />

            {/* Detailed Explanation */}
            <p className="text-xs font-normal text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {item.explanation}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
};
