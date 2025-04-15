import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import Alert from '@/Components/Alert';

export default function MemberList({ members, classroomId, isOwner }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(members);

    // State untuk Alert
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');

    // Filter members based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMembers(members);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = members.filter(member => 
                member.user?.name?.toLowerCase().includes(query) || 
                member.user?.email?.toLowerCase().includes(query)
            );
            setFilteredMembers(filtered);
        }
    }, [searchQuery, members]);

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
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

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
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isOwner ? 2 : 1} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                                            No members found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 text-xs sm:text-sm text-gray-500">
                    {filteredMembers.length} of {members.length} members displayed
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