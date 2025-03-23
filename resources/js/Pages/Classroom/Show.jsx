import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import MemberList from './Member/MemberList';
import Alert from '@/Components/Alert';
import AssignmentsTab from './Assignment/AssignmentsTab';
import MaterialsTab from './Material/MaterialsTab';
import StreamTab from './Stream/StreamTab';
import GradeTab from './Grade/GradeTab';

export default function Show({ auth, classroom, materials = [], assignments = [], submissions = [], announcements = [], streams = [] }) {
    const isOwner = classroom.user_id === auth.user.id;
    const members = classroom.members || [];
    const [activeTab, setActiveTab] = useState('stream');
    const [alertOpen, setAlertOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const setActiveTabWithStorage = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
        setMobileMenuOpen(false); // Close mobile menu when tab is selected
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

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 sm:mb-6">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{classroom.classname}</h2>
                                    <p className="mt-2 text-gray-600 text-sm sm:text-base">{classroom.description}</p>
                                </div>
                                {isOwner && (
                                    <Link
                                        href={route('classrooms.edit', classroom.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 w-full sm:w-auto justify-center"
                                    >
                                        Edit Class
                                    </Link>
                                )}
                            </div>
                            
                            {/* Class Code */}
                            {isOwner && (
                                <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-md">
                                    <h3 className="font-medium text-gray-700">Class Code</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className="font-mono bg-white px-3 py-1 border border-gray-300 rounded text-sm overflow-x-auto max-w-full">{classroom.classcode}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyCode}
                                            className="text-sm text-blue-600 hover:text-blue-800"
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
                            {/* Mobile Tab Selector */}
                            <div className="sm:hidden">
                                <div className="flex justify-between items-center px-4 py-3">
                                    <span className="text-gray-900 font-medium">
                                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                    </span>
                                    <button 
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                        </svg>
                                    </button>
                                </div>
                                
                                {mobileMenuOpen && (
                                    <div className="px-2 pb-3 space-y-1">
                                        {['stream', 'assignments', 'materials', 'members', ...(isOwner ? ['grade'] : [])].map((tab) => (
                                            <button
                                                key={tab}
                                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                                    activeTab === tab
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                                onClick={() => setActiveTabWithStorage(tab)}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Desktop Tabs */}
                            <nav className="hidden sm:flex overflow-x-auto">
                                {['stream', 'assignments', 'materials', 'members', ...(isOwner ? ['grade'] : [])].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                                            activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTabWithStorage(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'stream' && (
                                <StreamTab 
                                    classroom={classroom}
                                    announcements={announcements}
                                    streams={streams}
                                    auth={auth.user}
                                />
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

                            {activeTab === 'members' && (
                                <MemberList 
                                    members={members} 
                                    classroomId={classroom.id} 
                                    isOwner={isOwner} 
                                />
                            )}

                            {/* Grade Tab */}
                            {activeTab === 'grade' && isOwner && (
                                <GradeTab 
                                    classroom={classroom}
                                    assignments={assignments}
                                    members={members}
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