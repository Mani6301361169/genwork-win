import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { CampusChallenge } from '../../types';
import { BookOpen, Monitor, ShieldAlert, Award, FileCode, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CampusChallenges: React.FC = () => {
  const navigate = useNavigate();
  const [campusList, setCampusList] = useState<CampusChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const res = await apiFetch<{ campusChallenges: CampusChallenge[] }>('/analytics/campus');
        setCampusList(res.campusChallenges);
      } catch (err) {
        console.error('Failed to load campus challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);

  // Hardcoded sets matching Image 3 if API returns empty
  const campusCuratedSets = [
    {
      id: 'cse-1',
      title: 'CSE',
      description: 'fundamental CSE questions',
      total: 3,
      completed: 0,
      pending: 3,
      iconBg: 'bg-teal-600 text-white',
    },
    {
      id: 'servicenow-1',
      title: 'ServiceNow',
      description: 'Practice ServiceNow interview questions and real-world scenarios.',
      total: 13,
      completed: 0,
      pending: 13,
      iconBg: 'bg-lime-700 text-white',
    },
    {
      id: 'abap-1',
      title: 'Screening Test - ABAP',
      description: 'For Communication Assessment on 23-08-2026',
      total: 3,
      completed: 0,
      pending: 3,
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'ceh-1',
      title: 'CEH (Certified Ethical Hacker) - Ethical Hacking Fundame...',
      description: 'Master ethical hacking concepts with CEH interview practice',
      total: 8,
      completed: 0,
      pending: 8,
      iconBg: 'bg-purple-600 text-white',
    },
    {
      id: 'sap-bank-1',
      title: 'SAP ABAP Interview Question Bank',
      description: '100 practice questions mapped to your 45-day ABAP training plan, organized phase by phase.',
      total: 100,
      completed: 0,
      pending: 100,
      iconBg: 'bg-yellow-500 text-white',
    },
    {
      id: 'hr-mock-1',
      title: 'MOCK HR Practice',
      description: 'list of behavioral mock interview questions',
      total: 17,
      completed: 0,
      pending: 17,
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'sap-abap-2',
      title: 'SAP ABAP',
      description: 'Exclusive to ABAP relevant drives',
      total: 2,
      completed: 0,
      pending: 2,
      iconBg: 'bg-teal-600 text-white',
    },
    {
      id: 'python-1',
      title: 'Python',
      description: 'Interview questions for Python',
      total: 11,
      completed: 0,
      pending: 11,
      iconBg: 'bg-emerald-700 text-white',
    },
  ];

  const setsToDisplay = campusList.length > 0 ? campusList.map((c, i) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    total: c.totalQuestions,
    completed: c.completed,
    pending: c.remaining,
    iconBg: i % 4 === 0 ? 'bg-teal-600 text-white' : i % 4 === 1 ? 'bg-lime-700 text-white' : i % 4 === 2 ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white',
  })) : campusCuratedSets;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HEADER TITLE */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500">Practice sets curated by your institution</p>
      </div>

      {/* NOTICE BANNER */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-2 text-indigo-900 text-xs font-semibold leading-relaxed">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>Scores from Campus Challenges are not included in your WinSpeak Score or Leaderboard ranking.</span>
      </div>

      {/* 2-COLUMN GRID OF CURATED CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {setsToDisplay.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate('/student/challenges')}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              {/* Icon Badge */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-sm ${item.iconBg}`}>
                <BookOpen className="w-5 h-5" />
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Total / Completed / Pending Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                {item.total} Total
              </span>

              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                {item.completed} Completed
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200">
                {item.pending} Pending
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
