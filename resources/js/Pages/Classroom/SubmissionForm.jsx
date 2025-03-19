import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import boxicons from 'boxicons';

export default function SubmissionsForm({ show, onClose, assignmentId }) {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        if (show) {
            axios
                .get(`/assignments/${assignmentId}/submissions`)
                .then((response) => setSubmissions(response.data))
                .catch((error) => console.error(error));
        }
    }, [show, assignmentId]);

    return (
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
                <ul>
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

                            <a
                                href={`/storage/${submission.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View File
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
}