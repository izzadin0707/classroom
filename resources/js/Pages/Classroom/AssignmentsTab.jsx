import React, { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import AssignmentForm from './AssignmentForm';
import ConfirmModal from '@/Components/ConfirmModal';
import SubmissionUpload from './SubmissionUpload';
import SubmissionForm from './SubmissionForm';
import { router } from '@inertiajs/react';
import Alert from '@/Components/Alert';
import boxicons from 'boxicons';

export default function AssignmentsTab({ classroom, assignments, submissions, auth, isOwner }) {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });
    
    // State untuk konfirmasi pembatalan submission
    const [confirmCancelSubmission, setConfirmCancelSubmission] = useState(false);
    const [submissionToCancel, setSubmissionToCancel] = useState(null);

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
    
    // Pada bagian handleSubmissionSuccess perlu ditambahkan
    const handleSubmissionSuccess = (message) => {
        setShowUploadModal(false);
        showAlert('success', message);
    };

    // Pada bagian handleSubmissionError perlu ditambahkan
    const handleSubmissionError = (message) => {
        showAlert('error', message);
    };

    const openViewSubmissionsModal = (assignment) => {
        setSelectedAssignment(assignment);
        setShowViewSubmissionsModal(true);
    };
    
    // Fungsi untuk menangani pembatalan submission
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
    
    // Fungsi untuk melakukan proses pembatalan submission
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
    
    // Helper function untuk mengecek apakah user sudah submit
    const hasSubmitted = (assignmentId) => {
        return submissions.some(sub => 
            sub.assignment_id === assignmentId && 
            sub.student_id === auth.id
        );
    };
    
    // Helper function untuk mendapatkan submission user
    const getUserSubmission = (assignmentId) => {
        return submissions.find(sub => 
            sub.assignment_id === assignmentId && 
            sub.student_id === classroom.user_id
        );
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header with action button */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">Assignments</h3>
                    {isOwner && (
                        <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Assignment
                        </button>
                    )}
                </div>

                <hr />
                
                {/* Assignments Grid */}
                {assignments.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No assignments yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assignments.map((assignment) => {
                            const submitted = hasSubmitted(assignment.id);
                            const userSubmission = getUserSubmission(assignment.id);
                            
                            return (
                                <div key={assignment.id} className="overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-sm hover:shadow-md">
                                    <div className="p-5 relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-semibold text-gray-900 truncate">{assignment.title}</h4>
                                            <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mb-4 text-sm text-gray-600 line-clamp-3">{assignment.description}</p>

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

                                        <div className="flex justify-between items-center">
                                            {!isOwner && (
                                                <div className="flex space-x-2">
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
                                                                onClick={() => handleCancelSubmission(assignment)}
                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => openUploadModal(assignment)}
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
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
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
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
            </div>

            {/* Assignment Modal */}
            <Modal
                show={showAssignmentModal}
                onClose={closeAssignmentModal}
                maxWidth="md"
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

            {/* Submission Upload Modal */}
            <SubmissionUpload
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                assignmentId={selectedAssignment?.id}
                onSuccess={handleSubmissionSuccess}
                onError={handleSubmissionError}
            />

            {/* Submission Form Modal */}
            <SubmissionForm
                show={showViewSubmissionsModal}
                onClose={() => setShowViewSubmissionsModal(false)}
                assignmentId={selectedAssignment?.id}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={confirmDeleteAssignment}
                title="Delete Assignment"
                message="Are you sure you want to delete this assignment? This action cannot be undone."
            />
            
            {/* Confirm Cancel Submission Modal */}
            <ConfirmModal
                isOpen={confirmCancelSubmission}
                onClose={() => setConfirmCancelSubmission(false)}
                onConfirm={confirmCancelSubmissionAction}
                title="Cancel Submission"
                message="Are you sure you want to cancel this submission? This action cannot be undone."
            />

            {/* Alert */}
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