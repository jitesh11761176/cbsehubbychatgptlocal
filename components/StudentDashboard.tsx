
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, ClipboardListIcon, TrendingDownIcon } from './icons';
import { getStudentDashboardData, StudentCourse, RecentAttempt, WeakTopic } from '../api/mockApi';
import { View } from '../App';

interface StudentDashboardProps {
  setView: (view: View) => void;
  setCurrentAttemptId: (id: string | null) => void;
}

interface DashboardData {
  courses: StudentCourse[];
  recentAttempts: RecentAttempt[];
  weakTopics: WeakTopic[];
  continueLearningTopic: { title: string; chapter: string } | null;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ setView, setCurrentAttemptId }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from the API
    const fetchedData = getStudentDashboardData();
    setData(fetchedData);
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="mt-2 text-lg text-slate-600">Let's continue your learning journey today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content: My Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">My Courses</h2>
          <div className="space-y-4">
            {data.courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-700">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Taught by {course.teacher}</p>
                  </div>
                  <a href="#" className="mt-4 sm:mt-0 inline-block rounded-md bg-indigo-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Go to Course
                  </a>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm font-medium text-slate-700">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {data.weakTopics.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Focus Area</h2>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-amber-100 text-amber-600 rounded-lg p-2">
                      <TrendingDownIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Revise Weak Topics</h4>
                      <p className="text-sm text-slate-500 mb-3">Focus on these areas to improve your score.</p>
                      <div className="flex flex-wrap gap-2">
                        {data.weakTopics.map(topic => (
                           <span key={topic.id} className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">{topic.title}</span>
                        ))}
                      </div>
                       <a href="#" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">Start Revising &rarr;</a>
                    </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Recent Attempts</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <ul className="space-y-4">
                {data.recentAttempts.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-rose-100 text-rose-600 rounded-lg p-2">
                      <ClipboardListIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.course}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-slate-800">{item.score}/{item.totalMarks}</p>
                        {/* 
                          This button is currently disabled as the AttemptResult component is not
                          part of the application's file set in this context. 
                          It is wired up to work once the component exists.
                        
                          <button 
                            onClick={() => {
                              setCurrentAttemptId(item.id);
                              setView('exam-result');
                            }}
                            className="text-sm text-indigo-600 hover:underline"
                          >
                            View
                          </button> 
                        */}
                    </div>
                  </li>
                ))}
                 {data.recentAttempts.length === 0 && <p className="text-slate-500 text-sm">No recent exam attempts found.</p>}
              </ul>
            </div>
          </div>
          
          {data.continueLearningTopic && (
             <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800">Continue Learning</h2>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-sky-100 text-sky-600 rounded-lg p-2">
                          <BookOpenIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Last viewed: {data.continueLearningTopic.chapter}</p>
                          <h4 className="font-semibold text-slate-800">{data.continueLearningTopic.title}</h4>
                          <p className="text-sm text-indigo-600 hover:underline mt-1">Jump back in &rarr;</p>
                        </div>
                    </div>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
