import React from 'react';
import { useForm } from '@inertiajs/react';

export default function GradeForm({ assignmentId, submissionId, onSuccess, onCancel, initialGrade = '', initialFeedback = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        submission_id: submissionId,
        grade: initialGrade || '',
        feedback: initialFeedback || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/assignments/${assignmentId}/grade`, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Grade (0-100)</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.grade}
                    onChange={(e) => setData('grade', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                    value={data.feedback}
                    onChange={(e) => setData('feedback', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide feedback to the student..."
                />
                {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save Grade'}
                </button>
            </div>
        </form>
    );
}