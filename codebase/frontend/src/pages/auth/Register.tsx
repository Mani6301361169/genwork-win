import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Department } from '../../types';
import { UserPlus } from 'lucide-react';

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept-cse-gen', code: 'CSE-GEN', name: 'Computer Science & Engineering (General)' },
  { id: 'dept-cse-ai', code: 'CSE-AI', name: 'Computer Science & Engineering (AI)' },
  { id: 'dept-cse-cs', code: 'CSE-CS', name: 'Computer Science & Engineering (Cyber Security)' },
  { id: 'dept-ece', code: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'dept-aiml', code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { id: 'dept-civil', code: 'CIVIL', name: 'Civil Engineering' },
];

export const Register: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    college: 'CHALAPATHI INSTITUTE OF TECHNOLOGY',
    departmentId: DEFAULT_DEPARTMENTS[0].id,
    academicYear: '3rd Year',
    graduationYear: '2026',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiFetch<{ departments: Department[] }>('/auth/departments');
        if (res.departments && res.departments.length > 0) {
          setDepartments(res.departments);
          setFormData((prev) => ({ ...prev, departmentId: res.departments[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiFetch<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      login(data.token, data.user);
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-2xl shadow-sm mb-4 border-2 border-black">
          SS
        </div>
        <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">
          Join SkillSprint
        </h2>
        <p className="mt-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
          Create your student account & start your placement preparation journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white dark:bg-neutral-900 py-8 px-6 sm:px-10 shadow-lg border-2 border-black dark:border-white rounded-3xl">
          
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white text-xs font-black">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Student ID */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Student ID / Roll No *
              </label>
              <input
                type="text"
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                placeholder="21CS001"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Johnson"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* College Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                College Name
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Department *
              </label>
              <select
                name="departmentId"
                required
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} – {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Academic Year *
              </label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Graduation Year */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-bold focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-2 border-black font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Registering...' : 'Register Student Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-600 dark:text-neutral-400 font-bold">
            Already registered?{' '}
            <Link to="/login" className="font-black text-black dark:text-white hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
