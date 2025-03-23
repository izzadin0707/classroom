import React from 'react';
import { useForm } from '@inertiajs/react';

export default function AssignmentForm({ classroomId, onSuccess, onError, onCancel, assignment = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: assignment?.title || '',
        description: assignment?.description || assignment?.content || '',
        due_date: assignment?.due_date ? new Date(assignment.due_date).toISOString().split('T')[0] : '',
        file: null,
        class_id: classroomId,
        _method: assignment ? 'put' : 'post', // Tambahkan _method untuk memastikan method yang benar
    });

    const isEditing = !!assignment;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            // Menggunakan method post dengan _method: 'put' untuk mendukung upload file
            post(`/assignments/${assignment.id}`, {
                forceFormData: true, // Memaksa penggunaan FormData untuk upload file
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (onError) onError();
                },
            });
        } else {
            post('/assignments', {
                forceFormData: true, // Memaksa penggunaan FormData untuk upload file
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (onError) onError();
                },
            });
        }
    };

    console.log('test')

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {isEditing ? 'Replace File (Optional)' : 'File (Optional)'}
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="mt-1 block w-full border border-gray-300 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                    
                    {isEditing && assignment.file_path && (
                        <div className="mt-2 text-sm text-gray-600">
                            Current file: <a href={`/storage/${assignment.file_path}`} target="_blank" className="text-blue-600 hover:underline">View</a>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : isEditing ? 'Update Assignment' : 'Create Assignment'}
                    </button>
                </div>
            </form>
        </>
    );
}