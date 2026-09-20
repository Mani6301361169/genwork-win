import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { MessageSquare, Users, Send, CheckCircle2, Calendar, CheckSquare } from 'lucide-react';

export const FeedbackMentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FEEDBACK' | 'MENTORING' | 'ACTION_ITEMS'>('FEEDBACK');
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans text-black">
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-black" /> Mentoring, Feedback & Action Items
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Submit platform feedback, view upcoming faculty 1-on-1 mentoring sessions, and track placement action items.
        </p>
      </div>

      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* Toggle Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl border-2 border-black mb-6">
          <button
            onClick={() => { setActiveTab('FEEDBACK'); setIsSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'FEEDBACK'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Comments & Feedback
          </button>
          <button
            onClick={() => { setActiveTab('MENTORING'); setIsSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'MENTORING'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4" /> Mentoring Sessions
          </button>
          <button
            onClick={() => { setActiveTab('ACTION_ITEMS'); setIsSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              activeTab === 'ACTION_ITEMS'
                ? 'bg-black text-white shadow-xs border-black'
                : 'text-black hover:bg-zinc-200 border-transparent'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Action Items
          </button>
        </div>

        {activeTab === 'FEEDBACK' && (
          isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-black mx-auto" />
              <h3 className="text-base font-extrabold text-black">Inquiry & Feedback Submitted!</h3>
              <p className="text-xs text-zinc-700 font-medium max-w-md mx-auto">
                Thank you! Our placement faculty & mentors will review your message shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-3 bg-black text-white rounded-xl text-xs font-extrabold border-2 border-black"
              >
                Submit Another Inquiry
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
                  <option value="Platform">Platform & Technical Features</option>
                  <option value="Content">Speaking Content & Prompts</option>
                  <option value="Mentoring">1-on-1 Faculty Mentoring</option>
                  <option value="Placement">Campus Placement Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black mb-1 uppercase tracking-wider">
                  Subject
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
                  Message & Detailed Request
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide detailed comments or your availability for mentoring..."
                  className="w-full p-4 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 border-2 border-black"
              >
                <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )
        )}

        {activeTab === 'MENTORING' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded">Upcoming Session</span>
                <h4 className="text-xs font-extrabold text-black mt-1">1-on-1 Resume & Technical Interview Review</h4>
                <p className="text-[11px] text-zinc-600 font-medium">Faculty Mentor: Dr. Rajesh Sharma (CS Dept)</p>
              </div>
              <span className="text-xs font-extrabold text-black bg-white border border-black px-3 py-1 rounded-lg">
                Tomorrow, 4:00 PM
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-zinc-200 text-black px-2 py-0.5 rounded border border-black">Completed</span>
                <h4 className="text-xs font-extrabold text-black mt-1">Mock HR Behavioral Communication Practice</h4>
                <p className="text-[11px] text-zinc-600 font-medium">Faculty Mentor: Prof. Anita Rao</p>
              </div>
              <span className="text-xs font-extrabold text-black">
                Score: 85/100
              </span>
            </div>
          </div>
        )}

        {activeTab === 'ACTION_ITEMS' && (
          <div className="space-y-3">
            {[
              { title: 'Record 3 Speaking Practice Prompts (>30s)', status: 'In Progress', due: 'Today' },
              { title: 'Complete Software Engineer AI Mock Interview', status: 'Pending', due: 'This Week' },
              { title: 'Review STAR Framework Learning Guide', status: 'Completed', due: 'Done' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-black shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-black">{item.title}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold">Due: {item.due}</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-black text-white border border-black">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
