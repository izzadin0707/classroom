import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Select from 'react-select';
import Alert from '@/Components/Alert';
import SubmissionView from '../Submission/SubmissionView';

export default function GradeTab({ classroom, assignments = [], members = [], isOwner = true, auth }) {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [grades, setGrades] = useState({});
    const [comments, setComments] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [savedGrades, setSavedGrades] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(members);
    const [showViewerModal, setShowViewerModal] = useState(false);

    // Format assignments for react-select
    const assignmentOptions = assignments.map(assignment => ({
        value: assignment.id,
        label: assignment.title
    }));

    // Load existing grades when assignment changes
    useEffect(() => {
        if (selectedAssignment) {
            loadGrades(selectedAssignment.value);
        }
    }, [selectedAssignment]);

    // Filter members based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMembers(members);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = members.filter(member => 
                member.user?.name?.toLowerCase().includes(query) || 
                member.user?.email?.toLowerCase().includes(query)
            );
            setFilteredMembers(filtered);
        }
    }, [searchQuery, members]);

    const loadGrades = async (assignmentId) => {
        setIsLoading(true);
        try {
            // Load submissions first
            const submissionsResponse = await axios.get(`/assignments/${assignmentId}/submissions`);
            const submissionsData = submissionsResponse.data;
            setSubmissions(submissionsData);
    
            // Then load grades
            const response = await axios.get(route('grades.index', { assignment_id: assignmentId }));
            
            const gradesData = {};
            const commentsData = {};
            
            // Convert array of grades to an object indexed by user_id
            response.data.forEach(grade => {
                gradesData[grade.user_id] = grade.score;
                commentsData[grade.user_id] = grade.comment || '';
            });
            
            setGrades(gradesData);
            setComments(commentsData);
            setSavedGrades(JSON.parse(JSON.stringify(gradesData)));
    
            // Debugging: Log submissions and their length
            console.log('Loaded Submissions:', submissionsData);
            console.log('Submissions Length:', submissionsData.length);
        } catch (error) {
            console.error('Error loading grades and submissions:', error);
            showAlert('Failed to load grades and submissions', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGradeChange = (userId, value) => {
        setGrades(prev => ({
            ...prev,
            [userId]: value
        }));
    };

    const handleCommentChange = (userId, value) => {
        setComments(prev => ({
            ...prev,
            [userId]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const saveGrade = async (userId) => {
        try {
            await axios.post(route('grades.store'), {
                assignment_id: selectedAssignment.value,
                user_id: userId,
                score: grades[userId],
                comment: comments[userId]
            });
            
            // Update saved grades
            setSavedGrades(prev => ({
                ...prev,
                [userId]: grades[userId]
            }));
            
            showAlert('Grade saved successfully', 'success');
        } catch (error) {
            console.error('Error saving grade:', error);
            showAlert('Failed to save grade', 'error');
        }
    };

    const saveAllGrades = async () => {
        setIsLoading(true);
        try {
            const gradeData = members.map(member => ({
                assignment_id: selectedAssignment.value,
                user_id: member.user_id,
                score: grades[member.user_id] || null,
                comment: comments[member.user_id] || ''
            }));

            await axios.post(route('grades.store-batch'), { grades: gradeData });
            
            // Update all saved grades
            setSavedGrades(JSON.parse(JSON.stringify(grades)));
            showAlert('All grades saved successfully', 'success');
        } catch (error) {
            console.error('Error saving grades:', error);
            showAlert('Failed to save grades', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isGradeChanged = (userId) => {
        return grades[userId] !== savedGrades[userId];
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, show: false }));
    };

    const handleSubmissionStatusChange = (submissionId, newStatus) => {
        // Update the submissions list with the new status
        const updatedSubmissions = submissions.map(sub => 
            sub.id === submissionId ? {...sub, status: newStatus} : sub
        );
        setSubmissions(updatedSubmissions);
    };

    const openSubmissionViewer = (submission) => {
        setSelectedSubmission(submission);
        setShowViewerModal(true);
    };

    const closeSubmissionViewer = () => {
        setShowViewerModal(false);
        setSelectedSubmission(null);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            accepted: { className: 'bg-green-100 text-green-800', text: 'Accepted' },
            revision: { className: 'bg-red-100 text-red-800', text: 'Needs Revision' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hidden sm:block">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Grade Management</h3>
            </div>
            
            <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Assignment
                </label>
                <Select
                    options={assignmentOptions}
                    value={selectedAssignment}
                    onChange={setSelectedAssignment}
                    placeholder="Select an assignment to grade..."
                    className="w-full sm:w-3/4 md:w-1/2"
                    isSearchable
                />
            </div>

            {selectedAssignment ? (
                <>
                    {/* Search bar */}
                    <div className="mb-4">
                        <div className="relative rounded-md shadow-sm w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Comment
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map((member) => {
                                            const userSubmission = submissions.find(sub => sub.student_id === member.user_id);
                                            console.log(userSubmission)

                                            return (
                                            <tr key={member.id}>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {/* Avatar */}
                                                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                {member.user?.name?.[0]?.toUpperCase() || '-'}
                                                            </span>
                                                        </div>
                                                        {/* Nama Siswa */}
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                                {member.user?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                                                {member.user?.email || 'No Email'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.1"
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-16 sm:w-20"
                                                            value={grades[member.user_id] || ''}
                                                            onChange={(e) => handleGradeChange(member.user_id, e.target.value ? parseFloat(e.target.value) : null)}
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Max: 100</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <textarea
                                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                                                        rows="1"
                                                        value={comments[member.user_id] || ''}
                                                        onChange={(e) => handleCommentChange(member.user_id, e.target.value)}
                                                        placeholder="Add comment..."
                                                    />
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right sm:text-center">
                                                    <button
                                                        type="button"
                                                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md shadow-sm ${
                                                            isGradeChanged(member.user_id)
                                                                ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                                : 'text-gray-500 bg-gray-300 cursor-not-allowed'
                                                        }`}
                                                        onClick={() => saveGrade(member.user_id)}
                                                        disabled={!isGradeChanged(member.user_id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 ms-2 text-xs sm:text-sm font-medium rounded-md shadow-sm ${
                                                            userSubmission
                                                                ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                                                                : 'text-gray-500 bg-gray-300 cursor-not-allowed'
                                                        }`}
                                                        onClick={() => userSubmission && openSubmissionViewer(userSubmission)}>
                                                        Submission
                                                    </button>
                                                </td>
                                            </tr>
                                        )})
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                                                No students found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                        <div className="text-xs sm:text-sm text-gray-500">
                            {filteredMembers.length} of {members.length} students displayed
                        </div>
                        <button
                            type="button"
                            className="bg-green-100 hover:bg-green-200 text-green-700 py-1 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm"
                            onClick={saveAllGrades}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save All Grades'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-xs sm:text-sm text-yellow-700">
                                Please select an assignment to view and update grades.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Alert
                isOpen={alert.show}
                onClose={closeAlert}
                type={alert.type}
                message={alert.message}
                duration={3000}
            />

            {/* Submission Viewer Modal */}
            {selectedSubmission && (
                <SubmissionView
                    show={showViewerModal}
                    onClose={closeSubmissionViewer}
                    submission={selectedSubmission}
                    isOwner={isOwner}
                    onStatusChange={(newStatus) => handleSubmissionStatusChange(selectedSubmission.id, newStatus)}
                    auth={auth}
                />
            )}
        </div>
    );
}