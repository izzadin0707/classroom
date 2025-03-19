import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

export default function SubmissionUpload({ show, onClose, assignmentId, onSuccess, onError }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            // Menggunakan Inertia router sebagai pengganti axios
            router.post(`/assignments/${assignmentId}/submissions/upload`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    if (onSuccess) onSuccess('Submission uploaded successfully!');
                    onClose();
                },
                onError: (errors) => {
                    console.error(errors);
                    if (onError) onError('Failed to upload submission.');
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            if (onError) onError('Failed to upload submission.');
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4">
                <h2 className="text-lg font-bold mb-4">Upload Submission</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
                <div className='mt-3 flex justify-end space-x-2'>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        disabled={loading || !file}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}