
// api/mockApi.ts

// --- STUDENT DASHBOARD DATA TYPES ---
export interface StudentCourse {
  id: string;
  title: string;
  progress: number;
  teacher: string;
}

export interface RecentAttempt {
  id: string;
  title: string;
  course: string;
  score: number;
  totalMarks: number;
}

export interface WeakTopic {
  id: string;
  title: string;
}

// --- TEACHER DASHBOARD DATA TYPES ---
export interface StudentProgress {
  id: string;
  name: string;
  courseProgress: number;
  lastExamScore: string | null;
  lastActivity: string; // e.g., "2 days ago"
  weakTopics: string[];
}

export interface TeacherCourse {
  id: string;
  title: string;
  students: StudentProgress[];
}

// --- MOCK DATABASE ---
const db = {
  students: [
    { id: 'student-1', name: 'Sam Sharma' },
    { id: 'student-2', name: 'Priya Patel' },
    { id: 'student-3', name: 'Rohan Mehta' },
    { id: 'student-4', name: 'Aisha Khan' },
  ],
  teachers: [
    { id: 'teacher-1', name: 'Dr. Evelyn Reed' },
    { id: 'teacher-2', name: 'Mr. Alan Grant' },
  ],
  courses: [
    { id: 'course-cs', title: 'Class XII Computer Science', teacherId: 'teacher-1' },
    { id: 'course-phy', title: 'Class XII Physics', teacherId: 'teacher-2' },
  ],
  topics: {
    'course-cs': [
      { id: 't-cs-1', title: 'SQL' },
      { id: 't-cs-2', title: 'Data Structures' },
      { id: 't-cs-3', title: 'Computer Networks' },
      { id: 't-cs-4', title: 'Python Revision' },
    ],
    'course-phy': [
      { id: 't-phy-1', title: 'Optics' },
      { id: 't-phy-2', title: 'Electrostatics' },
      { id: 't-phy-3', title: 'Magnetism' },
      { id: 't-phy-4', title: 'Modern Physics' },
    ],
  },
  // Denormalized progress data
  progress: [
    // Sam Sharma's Progress
    { studentId: 'student-1', topicId: 't-cs-1', score: 90 },
    { studentId: 'student-1', topicId: 't-cs-2', score: 75 },
    { studentId: 'student-1', topicId: 't-cs-3', score: 45 }, // Weak
    { studentId: 'student-1', topicId: 't-phy-1', score: 65 },
    { studentId: 'student-1', topicId: 't-phy-2', score: 40 }, // Weak
    // Priya Patel's Progress
    { studentId: 'student-2', topicId: 't-cs-1', score: 95 },
    { studentId: 'student-2', topicId: 't-cs-2', score: 88 },
    { studentId: 'student-2', topicId: 't-cs-3', score: 92 },
    // Rohan Mehta's Progress
    { studentId: 'student-3', topicId: 't-cs-1', score: 60 },
    { studentId: 'student-3', topicId: 't-cs-2', score: 40 }, // Weak
    { studentId: 'student-3', topicId: 't-cs-3', score: 35 }, // Weak
    // Aisha Khan's Progress
    { studentId: 'student-4', topicId: 't-cs-1', score: 78 },
    { studentId: 'student-4', topicId: 't-cs-2', score: 82 },
    { studentId: 'student-4', topicId: 't-cs-3', score: 75 },
  ],
  attempts: {
    'student-1': [
        { id: 'attempt-1', title: 'Data Structures Test', course: 'Computer Science', score: 18, totalMarks: 25 },
        { id: 'attempt-2', title: 'Optics Practice', course: 'Physics', score: 12, totalMarks: 30 },
    ]
  }
};


// --- API FUNCTIONS ---

/**
 * Mocks fetching all data needed for the logged-in student's dashboard.
 * In a real app, this would be a single, optimized backend endpoint.
 */
export const getStudentDashboardData = () => {
  const studentId = 'student-1'; // Hardcoded for the logged-in user "Sam Sharma"
  
  const studentCourses: StudentCourse[] = db.courses.map(course => {
    const teacher = db.teachers.find(t => t.id === course.teacherId);
    const courseTopics = db.topics[course.id as keyof typeof db.topics] || [];
    const topicProgresses = db.progress.filter(p => p.studentId === studentId && courseTopics.some(t => t.id === p.topicId));
    
    const totalScore = topicProgresses.reduce((sum, p) => sum + p.score, 0);
    const progress = topicProgresses.length > 0 ? Math.round(totalScore / topicProgresses.length) : 0;
    
    return {
      id: course.id,
      title: course.title,
      progress: progress,
      teacher: teacher?.name || 'Unknown',
    };
  });
  
  const recentAttempts: RecentAttempt[] = db.attempts[studentId as keyof typeof db.attempts] || [];

  const allProgress = db.progress.filter(p => p.studentId === studentId);
  const allTopics = Object.values(db.topics).flat();
  
  const weakTopics: WeakTopic[] = allProgress
    .filter(p => p.score < 50)
    .map(p => {
      const topicInfo = allTopics.find(t => t.id === p.topicId);
      return { id: p.topicId, title: topicInfo?.title || 'Unknown Topic' };
    });

  return {
    courses: studentCourses,
    recentAttempts,
    weakTopics,
    continueLearningTopic: { title: 'Stacks', chapter: 'Data Structures' },
  };
};

/**
 * Mocks fetching data for the teacher dashboard, including all students for their courses.
 */
export const getTeacherDashboardData = () => {
    const teacherId = 'teacher-1'; // Hardcoded for logged-in teacher "Dr. Evelyn Reed"

    const teacherCourses: TeacherCourse[] = db.courses
        .filter(c => c.teacherId === teacherId || true) // Show all courses for demo
        .map(course => {
            const courseTopics = db.topics[course.id as keyof typeof db.topics] || [];
            
            const studentsInCourse = db.students.map(student => {
                const topicProgresses = db.progress.filter(p => p.studentId === student.id && courseTopics.some(t => t.id === p.topicId));
                if (topicProgresses.length === 0) return null; // Student not in this course

                const totalScore = topicProgresses.reduce((sum, p) => sum + p.score, 0);
                const courseProgress = Math.round(totalScore / topicProgresses.length);

                const studentAttempts = db.attempts[student.id as keyof typeof db.attempts] || [];
                const lastAttempt = studentAttempts.find(a => a.course === course.title.split(' ').slice(-2).join(' '));

                const weakTopics = topicProgresses
                    .filter(p => p.score < 50)
                    .map(p => courseTopics.find(t => t.id === p.topicId)?.title || '');
                
                return {
                    id: student.id,
                    name: student.name,
                    courseProgress: courseProgress,
                    lastExamScore: lastAttempt ? `${lastAttempt.score}/${lastAttempt.totalMarks}` : null,
                    lastActivity: `${Math.floor(Math.random() * 10) + 1} days ago`,
                    weakTopics: weakTopics.filter(Boolean),
                };
            }).filter((s): s is StudentProgress => s !== null);

            return {
                id: course.id,
                title: course.title,
                students: studentsInCourse,
            };
        });
    
    // Also include courses taught by other teachers for the demo selector
    const otherCourses = db.courses
        .filter(c => c.teacherId !== teacherId)
        .map(course => ({ id: course.id, title: course.title, students: [] }));


    return {
        courses: [...teacherCourses, ...otherCourses],
    };
};
