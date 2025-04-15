import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import Alert from '@/Components/Alert';
import MaterialForm from './MaterialForm';
import { router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function MaterialsTab({ classroom, materials, isOwner }) {
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [deletingMaterial, setDeletingMaterial] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState(materials);
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const showAlert = (type, message) => {
        setAlertState({
            isOpen: true,
            type,
            message
        });
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setShowMaterialModal(true);
    };

    const handleDeleteMaterial = (id) => {
        router.delete(`/materials/${id}`, {
            onSuccess: () => {
                showAlert('success', 'Material deleted successfully');
                setDeletingMaterial(null);
            },
            onError: () => {
                showAlert('error', 'Failed to delete material');
                setDeletingMaterial(null);
            }
        });
    };

    const handleModalClose = () => {
        setShowMaterialModal(false);
        setEditingMaterial(null);
    };

    const handleFormSuccess = () => {
        setShowMaterialModal(false);
        setEditingMaterial(null);
        showAlert('success', editingMaterial ? 'Material updated successfully' : 'Material added successfully');
    };

    const handleFormError = () => {
        showAlert('error', editingMaterial? 'Failed to update material. Please try again.' : 'Failed to create material. Please try again.');
    };

    // Filter materials based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMaterials(materials);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = materials.filter(material => 
                material.title.toLowerCase().includes(query) || 
                material.description?.toLowerCase().includes(query)
            );
            setFilteredMaterials(filtered);
        }
    }, [searchQuery, materials]);

    return (
        <>
            <div className="space-y-4 sm:space-y-6">
                {/* Header with action button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-800 my-1 hidden sm:block">Materials</h3>
                    {isOwner && (
                        <button
                            onClick={() => setShowMaterialModal(true)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                        >
                            <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Material
                        </button>
                    )}
                </div>

                <hr />

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
                            placeholder="Search materials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Materials List */}
                {filteredMaterials.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {searchQuery.trim() ? `No materials found matching "${searchQuery}"` : 'No learning materials available yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMaterials.map((material) => (
                            <div key={material.id} className="overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-sm hover:shadow-md">
                                <div className="p-4 sm:p-5">
                                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                        <h4 className="text-lg font-semibold text-gray-900 truncate">{material.title}</h4>
                                        <div className='text-end'>
                                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full self-start sm:self-auto">
                                                {new Date(material.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mb-10 text-sm text-gray-600 line-clamp-1">{material.description}</p>
                                    
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        {material.file_path && (
                                            <a 
                                                href={`/storage/${material.file_path}`} 
                                                target="_blank"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download
                                            </a>
                                        )}
                                        
                                        {isOwner && (
                                            <div className="flex space-x-2 ml-auto">
                                                <button
                                                    onClick={() => handleEditMaterial(material)}
                                                    className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                                >
                                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeletingMaterial(material)}
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
                        ))}
                    </div>
                )}

                <div className="mt-4 text-xs sm:text-sm text-gray-500">
                    {filteredMaterials.length} of {materials.length} materials displayed
                </div>
            </div>

            {/* Material Form Modal */}
            <Modal
                show={showMaterialModal}
                onClose={handleModalClose}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {editingMaterial ? 'Edit Material' : 'Add New Material'}
                    </h2>
                    <div className="mt-4">
                        <MaterialForm
                            classroomId={classroom.id}
                            onSuccess={handleFormSuccess}
                            onError={handleFormError}
                            onCancel={handleModalClose}
                            material={editingMaterial}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deletingMaterial}
                onClose={() => setDeletingMaterial(null)}
                onConfirm={() => handleDeleteMaterial(deletingMaterial.id)}
                title="Delete Material"
                message="Are you sure you want to delete this material? This action cannot be undone."
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