import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Edit({ auth, classroom }) {
    const { data, setData, put, errors, processing } = useForm({
        classname: classroom.classname || '',
        description: classroom.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('classrooms.update', classroom.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Edit Class: ${classroom.classname}`}
        >
            <Head title={`Edit ${classroom.classname}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <InputLabel htmlFor="classname" value="Class Name" />
                                <TextInput
                                    id="classname"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.classname}
                                    onChange={(e) => setData('classname', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Enter class name"
                                />
                                <InputError message={errors.classname} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    placeholder="Enter class description"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <div className="bg-gray-100 p-4 rounded-md">
                                    <h3 className="font-semibold text-gray-700">Class Code</h3>
                                    <p className="text-sm text-gray-500">Share this code with students to join your class:</p>
                                    <div className="mt-2 p-2 bg-white border border-gray-300 rounded flex justify-between items-center">
                                        <span className="font-mono text-lg">{classroom.classcode}</span>
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                navigator.clipboard.writeText(classroom.classcode);
                                                alert('Class code copied to clipboard!');
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>

                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Update Class
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}