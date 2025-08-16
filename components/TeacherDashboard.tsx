
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloudIcon, FileIcon, ArrowUpDownIcon } from './icons';
import { getTeacherDashboardData, TeacherCourse, StudentProgress } from '../api/mockApi';

// Mock data for existing resources to demonstrate download flow
const mockResources = [
  { name: 'Chapter 1 - SQL Basics.pdf', path: 'content/notes/12/Computer Science/Chapter 1 - SQL Basics.pdf' },
  { name: '2023 Sample Paper.pdf', path: 'content/papers/12/Computer Science/2023 Sample Paper.pdf' },
  { name: 'Full Syllabus 2024-25.pdf', path: 'content/syllabus/12/Computer Science/Full Syllabus 2024-25.pdf' },
  { name: 'course-intro.mp4', path: 'resources/course-123/resource-abc/course-intro.mp4' },
];

type Tab = 'content' | 'progress';
type SortKey = 'name' | 'progress' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

const ContentManagement: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'getting-url' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus('idle');
            setErrorMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadStatus('getting-url');
        setErrorMessage('');
        try {
            console.log(`[FRONTEND] Simulating: Requesting signed URL for file: ${file.name}`);
            await new Promise(resolve => setTimeout(resolve, 500));
            setUploadStatus('uploading');
            console.log(`[FRONTEND] Simulating: Uploading file directly to GCS...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`[FRONTEND] Simulating: Upload successful!`);
            setUploadStatus('success');
            setFile(null);
        } catch (error) {
            console.error('[FRONTEND] Upload failed:', error);
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    };

    const handleDownload = async (path: string) => {
        console.log(`[FRONTEND] Simulating: Requesting download URL for path: ${path}`);
        const mockSignedUrl = `https://storage.googleapis.com/mock-bucket/${path}?signature=...&expires=...`;
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`[FRONTEND] Simulating: Received download URL: ${mockSignedUrl}`);
        window.open(mockSignedUrl, '_blank');
    };

    const getStatusContent = () => {
        switch (uploadStatus) {
            case 'getting-url': return <p className="text-sm text-slate-500">Preparing upload...</p>;
            case 'uploading': return <p className="text-sm text-slate-500">Uploading file... please wait.</p>;
            case 'success': return <p className="text-sm text-green-600 font-semibold">File uploaded successfully!</p>;
            case 'error': return <p className="text-sm text-red-600">Upload failed: {errorMessage}</p>;
            default: return <p className="text-sm text-slate-500">Select a file (e.g., PDF, MP4, DOCX).</p>;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Upload New Resource</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <label htmlFor="file-upload" className="mt-4 block text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        <span>{file ? `Selected: ${file.name}` : 'Choose a file'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <div className="mt-2 h-5">{getStatusContent()}</div>
                </div>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'getting-url'}
                    className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    {uploadStatus === 'uploading' || uploadStatus === 'getting-url' ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Manage Existing Resources</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {mockResources.map((resource) => (
                        <div key={resource.path} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileIcon className="h-6 w-6 text-slate-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-700 truncate">{resource.name}</span>
                            </div>
                            <button onClick={() => handleDownload(resource.path)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0 ml-4">Download</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StudentProgressView: React.FC<{ students: StudentProgress[], onSort: (key: SortKey) => void, sortKey: SortKey, sortDirection: SortDirection }> = ({ students, onSort, sortKey, sortDirection }) => {
    const SortableHeader: React.FC<{ aKey: SortKey, children: React.ReactNode }> = ({ aKey, children }) => {
        const isSorted = sortKey === aKey;
        return (
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <button className="flex items-center gap-1 group" onClick={() => onSort(aKey)}>
                    {children}
                    <ArrowUpDownIcon className={`h-4 w-4 ${isSorted ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </button>
            </th>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Student Overview</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <SortableHeader aKey="name">Student Name</SortableHeader>
                            <SortableHeader aKey="progress">Course Progress</SortableHeader>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Exam Score</th>
                            <SortableHeader aKey="lastActivity">Last Activity</SortableHeader>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Weak Topics</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {students.map(student => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="flex items-center">
                                        <div className="w-24 bg-slate-200 rounded-full h-2.5 mr-2">
                                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${student.courseProgress}%` }}></div>
                                        </div>
                                        <span>{student.courseProgress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.lastExamScore || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.lastActivity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {student.weakTopics.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {student.weakTopics.map(topic => (
                                                <span key={topic} className="px-2 py-1 text-xs font-medium bg-rose-100 text-rose-800 rounded-full">{topic}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-green-600">None</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TeacherDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('progress');
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        const data = getTeacherDashboardData();
        setCourses(data.courses);
        if (data.courses.length > 0) {
            setSelectedCourseId(data.courses[0].id);
        }
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            const course = courses.find(c => c.id === selectedCourseId);
            setStudents(course?.students || []);
        }
    }, [selectedCourseId, courses]);

    const handleSort = (key: SortKey) => {
        const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortDirection(newDirection);
    };

    const filteredAndSortedStudents = useMemo(() => {
        return [...students]
            .filter(student => student.name.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
                if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [students, filter, sortKey, sortDirection]);

    const TabButton: React.FC<{ tab: Tab, children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Teacher Dashboard</h1>
            <p className="text-lg text-slate-600 mb-8">Manage your content and track student progress.</p>

            <div className="flex space-x-2 border-b border-slate-200 mb-6">
                <TabButton tab="progress">Student Progress</TabButton>
                <TabButton tab="content">Content Management</TabButton>
            </div>

            {activeTab === 'progress' && (
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                         <div className="flex-shrink-0">
                            <label htmlFor="course-select" className="sr-only">Select Course</label>
                            <select
                                id="course-select"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                         </div>
                        <input
                            type="text"
                            placeholder="Filter by student name..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {filteredAndSortedStudents.length > 0 ? (
                      <StudentProgressView students={filteredAndSortedStudents} onSort={handleSort} sortKey={sortKey} sortDirection={sortDirection} />
                    ) : (
                      <div className="text-center py-12 bg-white rounded-2xl shadow-lg mt-6">
                        <h3 className="text-lg font-medium text-slate-800">No students found</h3>
                        <p className="text-slate-500 mt-1">There are no students matching your filter in this course.</p>
                      </div>
                    )}
                </div>
            )}

            {activeTab === 'content' && <ContentManagement />}
        </div>
    );
};

export default TeacherDashboard;
