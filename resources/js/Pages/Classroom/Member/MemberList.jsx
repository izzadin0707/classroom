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
            <div className="space-y-1 sm:space-y-6">
                <div className="sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hidden">
                    <h3 className="text-xl font-semibold text-gray-800 my-1">Members</h3>
                </div>

                <hr className='hidden sm:block' />

                <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    {isOwner && (
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">
                                                        {member.user?.name?.[0]?.toUpperCase() || '-'}
                                                    </span>
                                                </div>
                                                {/* Nama Member */}
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {member.user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                                        {member.user?.email || 'No Email'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {isOwner && (
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right sm:text-center">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md shadow-sm text-red-700 bg-red-100 hover:bg-red-200"
                                                    onClick={() => handleKick(member)}
                                                >
                                                    Kick
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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