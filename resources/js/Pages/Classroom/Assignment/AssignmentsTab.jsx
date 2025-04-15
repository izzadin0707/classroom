import React, { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import AssignmentForm from './AssignmentForm';
import ConfirmModal from '@/Components/ConfirmModal';
import SubmissionUpload from '../Submission/SubmissionUpload';
import SubmissionList from '../Submission/SubmissionList';
import SubmissionView from '../Submission/SubmissionView';
import { router } from '@inertiajs/react';
import Alert from '@/Components/Alert';
import boxicons from 'boxicons';

export default function AssignmentsTab({ classroom, assignments, submissions, auth, isOwner }) {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showViewerModal, setShowViewerModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });
    
    const [confirmCancelSubmission, setConfirmCancelSubmission] = useState(false);
    const [submissionToCancel, setSubmissionToCancel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAssignments, setFilteredAssignments] = useState(assignments);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredAssignments(assignments);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = assignments.filter(assignment => 
                assignment.title.toLowerCase().includes(query) || 
                assignment.description?.toLowerCase().includes(query)
            );
            setFilteredAssignments(filtered);
        }
    }, [searchQuery, assignments]);

    const showAlert = (type, message) => {
        setAlertState({
            isOpen: true,
            type,
            message
        });
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setShowAssignmentModal(true);
    };

    const handleDelete = (assignment) => {
        setAssignmentToDelete(assignment);
        setConfirmDelete(true);
    };

    const confirmDeleteAssignment = () => {
        router.delete(`/assignments/${assignmentToDelete.id}`, {
            onSuccess: () => {
                showAlert('success', 'Assignment deleted successfully');
                setConfirmDelete(false);
                setAssignmentToDelete(null);
            },
            onError: () => {
                showAlert('error', 'Failed to delete assignment');
                setConfirmDelete(false);
                setAssignmentToDelete(null);
            }
        });
    };

    const closeAssignmentModal = () => {
        setShowAssignmentModal(false);
        setEditingAssignment(null);
    };

    const handleAssignmentSuccess = () => {
        closeAssignmentModal();
        showAlert('success', editingAssignment ? 'Assignment updated successfully' : 'Assignment added successfully');
    };

    const handleAssignmentError = () => {
        showAlert('error', editingAssignment ? 'Failed to update assignment. Please try again.' : 'Failed to create assignment. Please try again.');
    };

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewSubmissionsModal, setShowViewSubmissionsModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const openUploadModal = (assignment) => {
        setSelectedAssignment(assignment);
        setShowUploadModal(true);
    };
    
    const handleSubmissionSuccess = (message) => {
        setShowUploadModal(false);
        showAlert('success', message);
    };

    const handleSubmissionError = (message) => {
        showAlert('error', message);
    };

    const openViewSubmissionsModal = (assignment) => {
        setSelectedAssignment(assignment);
        setShowViewSubmissionsModal(true);
    };
    
    const handleCancelSubmission = (assignment) => {
        const submission = submissions.find(sub => 
            sub.assignment_id === assignment.id && 
            sub.student_id === auth.id
        );
        
        if (submission) {
            setSubmissionToCancel(submission);
            setConfirmCancelSubmission(true);
        }
    };
    
    const confirmCancelSubmissionAction = () => {
        router.delete(`/submissions/${submissionToCancel.id}`, {
            onSuccess: () => {
                showAlert('success', 'Submission cancelled successfully');
                setConfirmCancelSubmission(false);
                setSubmissionToCancel(null);
            },
            onError: () => {
                showAlert('error', 'Failed to cancel submission');
                setConfirmCancelSubmission(false);
                setSubmissionToCancel(null);
            }
        });
    };
    
    const hasSubmitted = (assignmentId) => {
        return submissions.some(sub => 
            sub.assignment_id === assignmentId && 
            sub.student_id === auth.id
        );
    };
    
    const getUserSubmission = (assignmentId) => {
        return submissions.find(sub => 
            sub.assignment_id === assignmentId && 
            sub.student_id === auth.id
        );
    };

    const openSubmissionViewer = (submission) => {
        setSelectedSubmission(submission);
        setShowViewerModal(true);
    };

    const closeSubmissionViewer = () => {
        setShowViewerModal(false);
        setSelectedSubmission(null);
    };

    return (
        <>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-800 my-1 hidden sm:block">Assignments</h3>
                    {isOwner && (
                        <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                        >
                            <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Assignment
                        </button>
                    )}
                </div>

                <hr />

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
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredAssignments.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {searchQuery.trim() ? `No assignments found matching "${searchQuery}"` : 'No assignments yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAssignments.map((assignment) => {
                            const submitted = hasSubmitted(assignment.id);
                            const userSubmission = getUserSubmission(assignment.id);
                            
                            return (
                                <div key={assignment.id} className="overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-sm hover:shadow-md">
                                    <div className="p-4 sm:p-5 relative">
                                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                            <h4 className="text-lg font-semibold text-gray-900 truncate">{assignment.title}</h4>
                                            <div className='text-end'>
                                                <span 
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                        new Date(assignment.due_date) < new Date()
                                                        ? 'text-red-800 bg-red-100'
                                                        : 'text-blue-800 bg-blue-100'
                                                    }`}>
                                                    {new Date(assignment.due_date) < new Date() && (
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
                                                            />
                                                        </svg>
                                                    )}
                                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mb-10 text-sm text-gray-600 line-clamp-1">{assignment.description}</p>

                                        {assignment.file_path && (
                                            <a 
                                                href={`/storage/${assignment.file_path}`} 
                                                target="_blank"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                
                                                Download
                                            </a>
                                        )}
                                        
                                        <hr className='my-3' />

                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            {!isOwner && (
                                                <div className="flex flex-wrap gap-2">
                                                    {submitted ? (
                                                        <>
                                                            <button
                                                                disabled
                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md cursor-default"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Uploaded
                                                            </button>
                                                            <button
                                                                onClick={() => openSubmissionViewer(userSubmission)}
                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                                            >
                                                                View Submission
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => openUploadModal(assignment)}
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-6l-4-4m0 0l-4 4m4-4v10" />
                                                            </svg>
                                                            Upload Submission
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {isOwner && (
                                                <button
                                                    onClick={() => openViewSubmissionsModal(assignment)}
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                                                >
                                                    Submissions ({submissions.filter(sub => sub.assignment_id === assignment.id).length})
                                                </button>
                                            )}
                                            
                                            {isOwner && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(assignment)}
                                                        className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                                    >
                                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(assignment)}
                                                        className="inline-flex items-center p-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                                                    >
                                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-4 text-xs sm:text-sm text-gray-500">
                    {filteredAssignments.length} of {assignments.length} assignments displayed
                </div>
            </div>

            <Modal
                show={showAssignmentModal}
                onClose={closeAssignmentModal}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
                    </h2>
                    <div className="mt-4">
                        <AssignmentForm
                            classroomId={classroom.id}
                            onSuccess={handleAssignmentSuccess}
                            onError={handleAssignmentError}
                            onCancel={closeAssignmentModal}
                            assignment={editingAssignment}
                        />
                    </div>
                </div>
            </Modal>

            <SubmissionUpload
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                assignmentId={selectedAssignment?.id}
                onSuccess={handleSubmissionSuccess}
                onError={handleSubmissionError}
            />

            <SubmissionList
                show={showViewSubmissionsModal}
                onClose={() => setShowViewSubmissionsModal(false)}
                assignmentId={selectedAssignment?.id}
                due_date={selectedAssignment?.due_date}
                isOwner={isOwner}
                auth={auth}
            />

            <SubmissionView
                show={showViewerModal}
                onClose={closeSubmissionViewer}
                submission={selectedSubmission}
                isOwner={isOwner}
                onStatusChange={(newStatus) => handleSubmissionStatusChange(selectedSubmission.id, newStatus)}
                auth={auth}
            />

            <ConfirmModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={confirmDeleteAssignment}
                title="Delete Assignment"
                message="Are you sure you want to delete this assignment? This action cannot be undone."
            />
            
            <ConfirmModal
                isOpen={confirmCancelSubmission}
                onClose={() => setConfirmCancelSubmission(false)}
                onConfirm={confirmCancelSubmissionAction}
                title="Cancel Submission"
                message="Are you sure you want to cancel this submission? This action cannot be undone."
            />

            <Alert
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                type={alertState.type}
                message={alertState.message}
                duration={3000}
            />
        </>
    );
}