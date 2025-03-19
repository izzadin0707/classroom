import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import Class from '@/Components/Class';
import { Head, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { useRef, useState } from 'react';

export default function Dashboard({ auth, ownedClassrooms = [], joinedClassrooms = [] }) {
    const [confirmingClassForm, setConfirmingClassForm] = useState(false);
    const [confirmingJoinForm, setConfirmingJoinForm] = useState(false);
    const classNameInput = useRef();

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        classname: '',
        description: '',
    });

    const joinForm = useForm({
        classcode: '',
    });

    const confirmClassForm = () => {
        setConfirmingClassForm(true);
    };

    const confirmJoinForm = () => {
        setConfirmingJoinForm(true);
    };

    const submitClass = (e) => {
        e.preventDefault();

        post(route('classrooms.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => classNameInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const submitJoin = (e) => {
        e.preventDefault();

        joinForm.post(route('classrooms.join'), {
            preserveScroll: true,
            onSuccess: () => closeJoinModal(),
            onFinish: () => joinForm.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingClassForm(false);
        clearErrors();
        reset();
    };

    const closeJoinModal = () => {
        setConfirmingJoinForm(false);
        joinForm.clearErrors();
        joinForm.reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Welcome to Classroom"
        >
            <Head title="Home" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Your Classes</h2>

                        <div className="flex space-x-4">
                            <button
                                onClick={confirmJoinForm}
                                className="inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-blue-500"
                            >
                                Join Class
                            </button>
                            <PrimaryButton
                                onClick={confirmClassForm}
                            >
                                Create Class
                            </PrimaryButton>
                        </div>
                    </div>

                    {ownedClassrooms.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Classes You Teach</h3>
                            <div className="flex flex-wrap gap-5">
                                {ownedClassrooms.map((classroom) => (
                                    <Class
                                        title={classroom.classname}
                                        description={classroom.description}
                                        isOwner={true}
                                        classroomId={classroom.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {joinedClassrooms.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Classes You're Enrolled In</h3>
                            <div className="flex flex-wrap gap-5">
                                {joinedClassrooms.map((classroom) => (
                                    <Class
                                        title={classroom.classname}
                                        description={classroom.description}
                                        isOwner={false}
                                        classroomId={classroom.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {ownedClassrooms.length === 0 && joinedClassrooms.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">You haven't created or joined any classes yet.</p>
                            <div className="mt-6 flex justify-center gap-3">
                                <PrimaryButton
                                    onClick={confirmClassForm}
                                >
                                    Create Your First Class
                                </PrimaryButton>
                                <button
                                    onClick={confirmJoinForm}
                                    className="inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-blue-500"
                                >
                                    Join a Class
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Class Modal */}
            <Modal show={confirmingClassForm} onClose={closeModal}>
                <form onSubmit={submitClass} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Create a New Class</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Enter the details for your new classroom.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="classname" value="Class Name" />
                        <TextInput
                            id="classname"
                            ref={classNameInput}
                            className="mt-1 block w-full"
                            value={data.classname}
                            onChange={(e) => setData('classname', e.target.value)}
                            required
                            isFocused
                            autoComplete="classname"
                            placeholder="Enter class name"
                        />
                        <InputError className="mt-2" message={errors.classname} />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="4"
                            placeholder="Enter class description"
                        ></textarea>
                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <DangerButton className="mr-3" onClick={closeModal}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton disabled={processing}>
                            Create Class
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Join Class Modal */}
            <Modal show={confirmingJoinForm} onClose={closeJoinModal}>
                <form onSubmit={submitJoin} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Join a Class</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Enter the class code provided by your teacher.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="classcode" value="Class Code" />
                        <TextInput
                            id="classcode"
                            className="mt-1 block w-full"
                            value={joinForm.data.classcode}
                            onChange={(e) => joinForm.setData('classcode', e.target.value)}
                            required
                            isFocused
                            autoComplete="off"
                            placeholder="Enter class code"
                        />
                        <InputError className="mt-2" message={joinForm.errors.classcode} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <DangerButton className="mr-3" onClick={closeJoinModal}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton disabled={joinForm.processing}>
                            Join Class
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}