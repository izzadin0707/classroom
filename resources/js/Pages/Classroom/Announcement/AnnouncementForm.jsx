import React from 'react';
import { useForm } from '@inertiajs/react';

export default function StreamForm({ classroomId, onSuccess, onError, onCancel, announcement = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: announcement?.title || '',
        content: announcement?.content || '',
        file: null,
        class_id: classroomId,
        _method: announcement ? 'put' : 'post',
    });

    const isEditing = !!announcement;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            post(`/announcements/${announcement.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (onError) onError();
                },
            });
        } else {
            post('/announcements', {
                forceFormData: true,
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
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        rows={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
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
                    
                    {isEditing && announcement.file_path && (
                        <div className="mt-2 text-sm text-gray-600">
                            Current file: <a href={`/storage/${announcement.file_path}`} target="_blank" className="text-blue-600 hover:underline">View</a>
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
                        {processing ? 'Saving...' : isEditing ? 'Update Announcement' : 'Create Announcement'}
                    </button>
                </div>
            </form>
        </>
    );
}