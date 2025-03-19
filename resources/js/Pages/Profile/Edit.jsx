import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Profile Settings" backUrl="history">
            <Head title="Profile Settings" />

            <div className="py-12 bg-gray-50">
                <div className="mx-auto max-w-4xl space-y-8 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                        {/* Update Profile Information */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Update Profile Information
                            </h3>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                        <hr />

                        {/* Update Password */}
                        <div className="my-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Update Password
                            </h3>
                            <UpdatePasswordForm />
                        </div>
                        <hr />

                        {/* Delete Account */}
                        <div className='mt-6'>
                            <h3 className="text-xl font-semibold text-red-600 mb-4">
                                Delete Account
                            </h3>
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
