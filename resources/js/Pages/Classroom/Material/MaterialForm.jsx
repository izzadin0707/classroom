import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function MaterialForm({ classroomId, material = null, onSuccess, onError, onCancel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: material ? material.title : '',
        description: material?.description || material?.content || '',
        file: null,
        class_id: classroomId,
        _method: material ? 'put' : 'post'
    });

    useEffect(() => {
        if (material) {
            setData({
                title: material.title,
                description: material?.description || material?.content,
                file: null,
                class_id: classroomId,
                _method: 'put'
            });
        }
    }, [material]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (material) {
            put(`/materials/${material.id}`, {
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (onError) onError();
                },
            });
        } else {
            post('/materials', {
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
                    <label className="block text-sm font-medium text-gray-700">
                        {material ? 'Replace File (optional)' : 'File'}
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="mt-1 block w-full border border-gray-300 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                    {material && material.file_path && (
                        <p className="text-sm text-gray-500 mt-1">
                            Current file: {material.file_path.split('/').pop()}
                        </p>
                    )}
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
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : material ? 'Update Material' : 'Upload Material'}
                    </button>
                </div>
            </form>
        </>
    );
}