import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { MessageSquare, Users, Send, CheckCircle2, Calendar, CheckSquare, Clock, UserCheck, Plus, Sparkles } from 'lucide-react';

export const FeedbackMentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SESSIONS' | 'ACTION_ITEMS' | 'COMMENTS'>('DASHBOARD');
  
  // Feedback state
  const [category, setCategory] = useState('Platform');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/analytics/feedback', {
        method: 'POST',
        body: JSON.stringify({ category, subject, message, rating }),
      });
      setIsSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionsList = [
    { id: 1, mentor: 'Dr. K. S. Ramanujam', dept: 'Computer Science', topic: '1-on-1 Technical Resume & Architecture Review', date: 'Tomorrow, Sept 21 • 4:00 PM', status: 'Upcoming' },
    { id: 2, mentor: 'Prof. Ananya Sen', dept: 'Training & Placements', topic: 'Behavioral HR Interview & Voice Modulation', date: 'Sept 24 • 2:30 PM', status: 'Scheduled' },
    { id: 3, mentor: 'Dr. V. Rajesh', dept: 'Electronics & Comm.', topic: 'System Design Mock Interview', date: 'Sept 15 • 11:00 AM', status: 'Completed', score: '88/100' },
  ];

  const actionItemsList = [
    { id: 1, title: 'Record 3 Speaking Practice Prompts (>30s Minimum)', category: 'Fluency', due: 'Today', status: 'In Progress' },
    { id: 2, title: 'Complete Software Developer AI Mock Interview', category: 'Interview Simulator', due: 'Sept 22', status: 'Pending' },
    { id: 3, title: 'Review STAR Framework Learning Guide', category: 'Learning Center', due: 'Completed', status: 'Done' },
    { id: 4, title: 'Submit Departmental Campus Challenge Attempt', category: 'Campus Challenges', due: 'Sept 25', status: 'Pending' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-black">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-black" /> Mentoring, Sessions & Action Items
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Manage faculty 1-on-1 coaching sessions, track placement action items, and submit student comments/feedback.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl border-2 border-black overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex-1 min-w-32 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'DASHBOARD'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" /> Mentoring Hub
          </button>

          <button
            onClick={() => setActiveTab('SESSIONS')}
            className={`flex-1 min-w-32 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'SESSIONS'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4" /> Sessions Schedule
          </button>

          <button
            onClick={() => setActiveTab('ACTION_ITEMS')}
            className={`flex-1 min-w-32 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'ACTION_ITEMS'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Action Items
          </button>

          <button
            onClick={() => setActiveTab('COMMENTS')}
            className={`flex-1 min-w-32 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'COMMENTS'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Comments & Feedback
          </button>
        </div>

        {/* 1. MENTORING DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            
            {/* Assigned Mentor Card */}
            <div className="bg-black text-white p-6 rounded-3xl border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white text-black font-extrabold text-xl flex items-center justify-center shrink-0 border border-black">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                    Assigned Placement Mentor
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">Dr. K. S. Ramanujam</h3>
                  <p className="text-xs text-zinc-300 font-medium">Head of Computer Science & Training • SkillSprint Faculty</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('SESSIONS')}
                className="px-5 py-3 bg-white text-black font-extrabold text-xs rounded-2xl border-2 border-white hover:bg-zinc-100 transition-colors shrink-0"
              >
                Book 1-on-1 Session
              </button>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black space-y-1">
                <span className="text-[10px] font-extrabold text-zinc-500 uppercase">Upcoming Session</span>
                <p className="text-sm font-extrabold text-black">Sept 21 • 4:00 PM</p>
                <p className="text-xs text-zinc-600 font-bold">Resume & Code Architecture</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black space-y-1">
                <span className="text-[10px] font-extrabold text-zinc-500 uppercase">Open Action Items</span>
                <p className="text-sm font-extrabold text-black">3 Tasks Pending</p>
                <p className="text-xs text-zinc-600 font-bold">Target Due: This Week</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black space-y-1">
                <span className="text-[10px] font-extrabold text-zinc-500 uppercase">Mentoring Rating</span>
                <p className="text-sm font-extrabold text-black">4.9 / 5.0 Rating</p>
                <p className="text-xs text-zinc-600 font-bold">Faculty Verified</p>
              </div>
            </div>

          </div>
        )}

        {/* 2. SESSIONS SCHEDULE */}
        {activeTab === 'SESSIONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-black">Scheduled Mentoring Sessions</h3>
              <button
                onClick={() => setActiveTab('COMMENTS')}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-black underline"
              >
                <Plus className="w-3.5 h-3.5" /> Request New Slot
              </button>
            </div>

            <div className="space-y-3">
              {sessionsList.map((session) => (
                <div key={session.id} className="p-5 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                        session.status === 'Upcoming' ? 'bg-black text-white' : 'bg-zinc-200 text-black border border-black'
                      }`}>
                        {session.status}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">{session.dept}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-black">{session.topic}</h4>
                    <p className="text-xs text-zinc-700 font-medium">Faculty Mentor: {session.mentor}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-extrabold text-black block">{session.date}</span>
                    {session.score && (
                      <span className="text-xs font-extrabold text-black mt-1 block">Score: {session.score}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ACTION ITEMS */}
        {activeTab === 'ACTION_ITEMS' && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black">Placement Preparation Action Checklist</h3>
            <div className="space-y-3">
              {actionItemsList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-black shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-black">{item.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold">Category: {item.category} • Due: {item.due}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border border-black ${
                    item.status === 'Done' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COMMENTS & FEEDBACK FORM */}
        {activeTab === 'COMMENTS' && (
          isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-black mx-auto" />
              <h3 className="text-base font-extrabold text-black">Comment & Inquiry Received!</h3>
              <p className="text-xs text-zinc-700 font-medium max-w-md mx-auto">
                Thank you! Our placement mentors & support team will review your message shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-3 bg-black text-white rounded-xl text-xs font-extrabold border-2 border-black"
              >
                Submit Another Comment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-black mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold"
                >
                  <option value="Platform">Platform & Audio Features</option>
                  <option value="Content">Speaking Content & Topics</option>
                  <option value="Mentoring">1-on-1 Faculty Mentoring</option>
                  <option value="Placement">Campus Placement Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black mb-1 uppercase tracking-wider">
                  Subject / Comment Title
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request mock technical interview with faculty mentor"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black mb-1 uppercase tracking-wider">
                  Comment Details & Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your comments or questions here..."
                  className="w-full p-4 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 border-2 border-black"
              >
                <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Post Comment'}
              </button>
            </form>
          )
        )}

      </div>
    </div>
  );
};
