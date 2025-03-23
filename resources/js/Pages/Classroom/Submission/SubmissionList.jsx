import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import boxicons from 'boxicons';
import SubmissionView from './SubmissionView';

export default function SubmissionList({ show, onClose, assignmentId, due_date, isOwner = true, auth }) {
    const [submissions, setSubmissions] = useState([]);
    const [showViewerModal, setShowViewerModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        if (show) {
            axios
                .get(`/assignments/${assignmentId}/submissions`)
                .then((response) => setSubmissions(response.data))
                .catch((error) => console.error(error));
        }
    }, [show, assignmentId]);

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
        <>
            <Modal show={show} onClose={onClose}>
                <div className="p-4 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <box-icon name="x" color="gray" size="sm"></box-icon>
                    </button>

                    <h2 className="text-lg font-bold mb-4">Submissions</h2>
                    
                    {submissions.length === 0 ? (
                        <div className="p-8 text-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No submissions yet</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {submissions.map((submission) => (
                                <li key={submission.id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                {submission.users?.name?.[0]?.toUpperCase() ?? '-'}
                                            </span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {submission.users?.name ?? 'Unknown'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {submission.users?.email ?? 'No Email'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-end flex-col gap-2'>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                    new Date(submission.submitted_at) > new Date(due_date)
                                                    ? 'text-red-800 bg-red-100'
                                                    : 'text-blue-800 bg-blue-100'
                                                }`}
                                            >
                                                {new Date(submission.submitted_at) > new Date(due_date) ? '(Late)' : ''}  Uploaded: {new Date(submission.submitted_at).toLocaleDateString()}
                                            </span>
                                            {getStatusBadge(submission.status || 'pending')}
                                        </div>
                                        <button
                                            onClick={() => openSubmissionViewer(submission)}
                                            className="items-center px-2 py-1 text-xs font-medium rounded-full text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                                        >
                                            View Submission
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Modal>

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
        </>
    );
}