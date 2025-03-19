import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import MemberList from './MemberList';
import Alert from '@/Components/Alert';
import AssignmentsTab from './AssignmentsTab';
import MaterialsTab from './MaterialsTab';

export default function Show({ auth, classroom, materials = [], assignments = [], submissions = [] }) {
    const isOwner = classroom.user_id === auth.user.id;
    const members = classroom.members || [];
    const [activeTab, setActiveTab] = useState('stream');
    const [alertOpen, setAlertOpen] = useState(false);

    const setActiveTabWithStorage = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setActiveTab(savedTab); 
        }
    }, []);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(classroom.classcode);
        setAlertOpen(true);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={classroom.classname} backUrl="dashboard">
            <Head title={classroom.classname} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{classroom.classname}</h2>
                                    <p className="mt-2 text-gray-600">{classroom.description}</p>
                                </div>
                                {isOwner && (
                                    <Link
                                        href={route('classrooms.edit', classroom.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        Edit Class
                                    </Link>
                                )}
                            </div>
                            
                            {/* Class Code */}
                            {isOwner && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-medium text-gray-700">Class Code</h3>
                                    <div className="mt-2 flex items-center">
                                        <span className="font-mono bg-white px-3 py-1 border border-gray-300 rounded">{classroom.classcode}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyCode}
                                            className="ml-3 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Copy Code
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Share this code with students to join your class.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                {['stream', 'assignments', 'materials', 'people'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                                            activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTabWithStorage(tab)} // Gunakan fungsi baru
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'stream' && (
                                <div className="text-center py-8">
                                    <p className="text-lg text-gray-600">
                                        Welcome to your class! Here's where announcements and class materials will appear.
                                    </p>
                                    {isOwner && (
                                        <PrimaryButton className="mt-4">
                                            Create Announcement
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                            
                            {/* Assignments Tab */}
                            {activeTab === 'assignments' && (
                                <AssignmentsTab 
                                    classroom={classroom}
                                    assignments={assignments}
                                    submissions={submissions}
                                    auth={auth.user}
                                    isOwner={isOwner}
                                />
                            )}

                            {/* Materials Tab */}
                            {activeTab === 'materials' && (
                                <MaterialsTab
                                    classroom={classroom}
                                    materials={materials}
                                    isOwner={isOwner}
                                />
                            )}

                            {activeTab === 'people' && (
                                <MemberList 
                                    members={members} 
                                    classroomId={classroom.id} 
                                    isOwner={isOwner} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert */}
            <Alert
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                type="success"
                message="Class code copied to clipboard!"
                duration={2000}
            />

        </AuthenticatedLayout>
    );
}