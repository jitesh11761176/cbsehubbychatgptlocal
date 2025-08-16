
import React from 'react';

const featureCards = [
  { title: "Latest Notes", description: "Access comprehensive notes for all subjects, updated regularly.", color: "bg-sky-100 text-sky-800" },
  { title: "Past Papers", description: "Practice with a vast collection of previous years' question papers.", color: "bg-amber-100 text-amber-800" },
  { title: "Interactive Syllabus", description: "Explore the latest CBSE syllabus with detailed topic breakdowns.", color: "bg-emerald-100 text-emerald-800" },
  { title: "Expert Tutors", description: "Connect with experienced tutors for personalized guidance.", color: "bg-rose-100 text-rose-800" },
  { title: "Subject Quizzes", description: "Test your knowledge with chapter-wise interactive quizzes.", color: "bg-violet-100 text-violet-800" },
  { title: "Video Lectures", description: "Learn complex topics through engaging video lectures.", color: "bg-cyan-100 text-cyan-800" },
];

const MainContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Your AI-Powered <span className="text-indigo-600">Learning Companion</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Everything you need for your CBSE preparation, from notes and papers to an AI assistant that's always ready to help.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <a href="#" className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-md hover:bg-indigo-700 transition-transform transform hover:-translate-y-1">Get Started</a>
            <a href="#" className="inline-block rounded-md bg-white px-6 py-3 text-center font-semibold text-indigo-600 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-transform transform hover:-translate-y-1">Learn More</a>
        </div>
      </div>
      <div className="mt-20 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <div className={`p-6 ${card.color}`}>
                <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <div className="p-6">
                <p className="text-slate-600">{card.description}</p>
                 <a href="#" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold">Explore &rarr;</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
