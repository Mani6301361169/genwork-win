import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Monitor, MessageSquare, Lightbulb, Code, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const InterviewPractice: React.FC = () => {
  const navigate = useNavigate();

  const practiceCards = [
    {
      id: 'explain-concept',
      title: 'Explain a Concept',
      description: 'Break down any topic clearly and simply.',
      icon: BookOpen,
      iconBg: 'bg-teal-600 text-white',
    },
    {
      id: 'give-presentation',
      title: 'Give Presentation',
      description: 'Practice your opening hook, body, and close.',
      icon: Monitor,
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'debate-talk',
      title: 'Debate Talk',
      description: 'Argue a position and rebut counterpoints effectively.',
      icon: MessageSquare,
      iconBg: 'bg-[#4d7c0f] text-white',
    },
    {
      id: 'shark-tank',
      title: 'Shark Tank',
      description: 'Pitch your business to the Sharks in 60 seconds – make every word count.',
      icon: Lightbulb,
      iconBg: 'bg-purple-600 text-white',
    },
    {
      id: 'technical-interview',
      title: 'Technical Interview',
      description: 'Answer JD-scoped technical questions under time pressure.',
      icon: Code,
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'behavioural-interview',
      title: 'Behavioural Interview',
      description: 'Use the STAR method to answer HR-style questions.',
      icon: HelpCircle,
      iconBg: 'bg-rose-600 text-white',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HERO BANNER: WARM UP CASUAL TALK */}
      <div className="bg-gradient-to-r from-[#5338ec] to-[#6d4df6] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-purple-400/20">
        
        <div className="space-y-3 max-w-xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wider">
            WARM UP
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Casual Talk
          </h1>

          <p className="text-xs sm:text-sm font-medium text-purple-100 leading-relaxed">
            Chat about anything. No scripts, no pressure. Just practice.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/student/challenges/1')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Start Practice <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Speech Bubbles Illustration */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20">
          <MessageCircle className="w-14 h-14 text-white" />
        </div>

      </div>

      {/* 2-COLUMN GRID OF PRACTICE ARENA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => navigate('/student/challenges/1')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-sm ${card.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mt-1">
                    {card.description}
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/student/challenges/1');
                  }}
                  className="px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Start Practice
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
