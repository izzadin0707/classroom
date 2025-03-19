import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div>
            {/* Header */}
            <h2 className="text-lg font-medium text-gray-900 mb-2">
                Delete Account
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Once your account is deleted, all of its resources and data will be permanently deleted. Please download any data you wish to retain.
            </p>

            {/* Delete Button */}
            <DangerButton onClick={confirmUserDeletion} className="transition hover:bg-red-700">
                Delete Account
            </DangerButton>

            {/* Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Confirm Account Deletion
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Please enter your password to confirm you would like to permanently delete your account.
                    </p>

                    {/* Password Input */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                            isFocused
                            placeholder="Enter your password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Modal Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="hover:bg-gray-100 transition">
                            Cancel
                        </SecondaryButton>
                        <DangerButton className="hover:bg-red-700 transition" disabled={processing}>
                            Confirm Deletion
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
