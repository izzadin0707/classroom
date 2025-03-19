import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import Alert from '@/Components/Alert';

export default function MemberList({ members, classroomId, isOwner }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // State untuk Alert
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');

    // Handle Kick
    const handleKick = (member) => {
        setSelectedMember(member);
        setModalOpen(true);
    };

    // Handle Konfirmasi Kick
    const confirmKick = () => {
        if (!selectedMember) return;
        
        // Tutup modal sebelum mengirim request
        setModalOpen(false);
        
        // Tampilkan alert loading
        setAlertType('info');
        setAlertMessage(`Kicking ${selectedMember.user?.name}...`);
        setAlertOpen(true);
        
        router.delete(route('classrooms.kick', { 
            classroom: classroomId, 
            member: selectedMember.id 
        }), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Tampilkan alert sukses
                setAlertType('success');
                setAlertMessage(`Successfully kicked ${selectedMember.user?.name}.`);
                setAlertOpen(true);
                
                // Reset selected member
                setSelectedMember(null);
            },
            onError: (errors) => {
                // Tampilkan alert error
                setAlertType('error');
                setAlertMessage(errors.error || `Failed to kick ${selectedMember.user?.name}.`);
                setAlertOpen(true);
            }
        });
    };

    if (!Array.isArray(members) || members.length === 0) {
        return <p className="pt-5 text-gray-500">No members have joined this class yet.</p>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 my-1">Class Materials</h3>
                </div>

                <hr />

                <ul className="divide-y divide-gray-200">
                    {members.map((member) => (
                        <li key={member.id} className="py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        {member.user?.name?.[0]?.toUpperCase() ?? '-'}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                        {member.user?.name ?? 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {member.user?.email ?? 'No Email'}
                                    </p>
                                </div>
                            </div>

                            {/* Tombol Kick */}
                            {isOwner && (
                                <button
                                    onClick={() => handleKick(member)}
                                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Kick
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal Konfirmasi */}
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmKick}
                title="Kick Member"
                message={`Are you sure you want to kick ${selectedMember?.user?.name}?`}
            />

            {/* Alert untuk feedback */}
            <Alert
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                type={alertType}
                message={alertMessage}
                duration={5000}
            />
        </>
    );
}