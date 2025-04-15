import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import Alert from '@/Components/Alert';
import { router } from '@inertiajs/react';

// Component imports
import AnnouncementForm from '../Announcement/AnnouncementForm';
import AssignmentForm from '../Assignment/AssignmentForm';
import MaterialForm from '../Material/MaterialForm';
import AnnouncementView from '../Announcement/AnnouncementView';
import AssignmentView from '../Assignment/AssignmentView';
import MaterialView from '../Material/MaterialView';

export default function StreamTab({ classroom, announcements = [], streams = [], auth }) {
    const isOwner = classroom.user_id === auth.id;
    
    // Modal state management
    const [modals, setModals] = useState({
        announcement: false,
        assignment: false,
        material: false,
        view: false,
        confirmDelete: false
    });
    
    // Content state management
    const [contentState, setContentState] = useState({
        editingAnnouncement: null,
        editingAssignment: null,
        editingMaterial: null,
        currentItem: null,
        announcementToDelete: null
    });
    
    // Alert state
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });

    // Helper Functions
    const showAlert = (type, message) => {
        setAlertState({
            isOpen: true,
            type,
            message
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const createStreamPairs = (streams) => {
        const pairs = [];
        for (let i = 0; i < streams.length; i += 2) {
            const pair = [streams[i]];
            if (i + 1 < streams.length) {
                pair.push(streams[i + 1]);
            }
            pairs.push(pair);
        }
        return pairs;
    };

    // Modal Management Functions
    const openModal = (modalType, item = null) => {
        setModals({
            ...modals,
            [modalType]: true
        });
        
        if (item) {
            switch (modalType) {
                case 'view':
                    setContentState({...contentState, currentItem: item});
                    break;
                case 'announcement':
                    setContentState({...contentState, editingAnnouncement: item});
                    break;
                case 'assignment':
                    setContentState({...contentState, editingAssignment: item});
                    break;
                case 'material':
                    setContentState({...contentState, editingMaterial: item});
                    break;
                default:
                    break;
            }
        }
    };

    const closeModal = (modalType) => {
        setModals({...modals, [modalType]: false});
        
        // Clear related state when closing modals
        switch (modalType) {
            case 'view':
                setContentState({...contentState, currentItem: null});
                break;
            case 'announcement':
                setContentState({...contentState, editingAnnouncement: null});
                break;
            case 'assignment':
                setContentState({...contentState, editingAssignment: null});
                break;
            case 'material':
                setContentState({...contentState, editingMaterial: null});
                break;
            case 'confirmDelete':
                setContentState({...contentState, announcementToDelete: null});
                break;
            default:
                break;
        }
    };

    // Content Action Handlers
    const handleEdit = (data, type) => {
        openModal(type, data);
    };

    const handleDelete = (data) => {
        setContentState({...contentState, announcementToDelete: data});
        setModals({...modals, confirmDelete: true});
    };

    const confirmDeleteAnnouncement = () => {
        router.delete(`/announcements/${contentState.announcementToDelete.id}`, {
            onSuccess: () => {
                showAlert('success', 'Announcement deleted successfully');
                closeModal('confirmDelete');
            },
            onError: () => {
                showAlert('error', 'Failed to delete announcement');
                closeModal('confirmDelete');
            }
        });
    };

    // Form Submission Handlers
    const handleSubmissionSuccess = (type, isEditing) => {
        closeModal(type);
        const actionType = isEditing ? 'updated' : 'added';
        showAlert('success', `${type.charAt(0).toUpperCase() + type.slice(1)} ${actionType} successfully`);
    };

    const handleSubmissionError = (type, isEditing) => {
        const actionType = isEditing ? 'update' : 'create';
        showAlert('error', `Failed to ${actionType} ${type}. Please try again.`);
    };

    // Render component based on stream type
    const renderContentView = () => {
        if (!contentState.currentItem) return null;
        
        switch (contentState.currentItem.type) {
            case 'announcement':
                return <AnnouncementView announcement={contentState.currentItem} />;
            case 'assignment':
                return <AssignmentView assignment={contentState.currentItem} />;
            case 'material':
                return <MaterialView material={contentState.currentItem} />;
            default:
                return <div>Unknown content type</div>;
        }
    };

    const streamPairs = createStreamPairs(streams);

    return (
        <>
            <div className="space-y-6">
                {streams.length > 0 && (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800 my-1">Announcements</h3>
                            {isOwner && (
                                <button
                                    onClick={() => openModal('announcement')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Announcement
                                </button>
                            )}
                        </div>
                        <hr />
                    </>
                )}

                {/* Streams List */}
                {streams.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600">
                            Welcome to your class! Here's where announcements and class materials will appear.
                        </p>
                        {isOwner && (
                            <button
                                onClick={() => openModal('announcement')}
                                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                            >
                                Create your first announcement
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {streamPairs.map((pair, pairIndex) => (
                            <div key={`pair-${pairIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pair.map((stream) => (
                                    <div 
                                        key={`${stream.type}-${stream.id}`} 
                                        className="overflow-hidden bg-white border rounded-lg shadow-sm h-full cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => openModal('view', stream)}
                                    >
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <span className='items-center px-2 py-1 text-xs font-medium rounded-full text-yellow-800 bg-yellow-100 mr-2'>
                                                            {stream.type.charAt(0).toUpperCase() + stream.type.slice(1)}
                                                        </span>
                                                        <p className="text-xs text-gray-500">{formatDate(stream.created_at)}</p>
                                                    </div>
                                                    
                                                    <h3 className="mb-2 text-xl font-medium text-gray-900">{stream.title}</h3>
                                                    <div className="prose text-gray-600 max-w-none line-clamp-1 overflow-hidden">
                                                        {stream.content.split('\n').map((paragraph, idx) => (
                                                            <p key={idx} className="mb-2">{paragraph}</p>
                                                        ))}
                                                    </div>
                                                    
                                                    {stream.file_path && (
                                                        <div className="mt-4">
                                                            <a 
                                                                href={`/storage/${stream.file_path}`} 
                                                                target="_blank"
                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                Download {stream.type.charAt(0).toUpperCase() + stream.type.slice(1)}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {isOwner && (
                                                    <div className="flex space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(stream, stream.type);
                                                            }}
                                                            className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                                        >
                                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        {stream.type === 'announcement' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(stream);
                                                                }}
                                                                className="inline-flex items-center p-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                                                            >
                                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Modal for Stream Items */}
            <Modal show={modals.view} onClose={() => closeModal('view')}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-medium text-gray-900">
                            {contentState.currentItem ? 
                                contentState.currentItem.type.charAt(0).toUpperCase() + contentState.currentItem.type.slice(1) : 
                                'Details'
                            }
                        </h2>
                    </div>
                    <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
                        {renderContentView()}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => closeModal('view')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Announcement Form Modal */}
            <Modal show={modals.announcement} onClose={() => closeModal('announcement')}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {contentState.editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                    </h2>
                    <div className="mt-4">
                        <AnnouncementForm
                            classroomId={classroom.id}
                            onSuccess={() => handleSubmissionSuccess('announcement', contentState.editingAnnouncement)}
                            onError={() => handleSubmissionError('announcement', contentState.editingAnnouncement)}
                            onCancel={() => closeModal('announcement')}
                            announcement={contentState.editingAnnouncement}
                        />
                    </div>
                </div>
            </Modal>

            {/* Assignment Form Modal */}
            <Modal show={modals.assignment} onClose={() => closeModal('assignment')}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {contentState.editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
                    </h2>
                    <div className="mt-4">
                        <AssignmentForm
                            classroomId={classroom.id}
                            onSuccess={() => handleSubmissionSuccess('assignment', contentState.editingAssignment)}
                            onError={() => handleSubmissionError('assignment', contentState.editingAssignment)}
                            onCancel={() => closeModal('assignment')}
                            assignment={contentState.editingAssignment}
                        />
                    </div>
                </div>
            </Modal>

            {/* Material Form Modal */}
            <Modal show={modals.material} onClose={() => closeModal('material')}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {contentState.editingMaterial ? 'Edit Material' : 'Add New Material'}
                    </h2>
                    <div className="mt-4">
                        <MaterialForm
                            classroomId={classroom.id}
                            onSuccess={() => handleSubmissionSuccess('material', contentState.editingMaterial)}
                            onError={() => handleSubmissionError('material', contentState.editingMaterial)}
                            onCancel={() => closeModal('material')}
                            material={contentState.editingMaterial}
                        />
                    </div>
                </div>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={modals.confirmDelete}
                onClose={() => closeModal('confirmDelete')}
                onConfirm={confirmDeleteAnnouncement}
                title="Delete Announcement"
                message="Are you sure you want to delete this announcement? This action cannot be undone."
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