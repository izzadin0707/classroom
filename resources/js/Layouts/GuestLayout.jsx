import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center mt-6 mb-6">
                <div className="flex justify-center">
                    {/* Logo Classroom */}
                    <svg
                        className="h-12 w-auto text-blue-600 lg:h-16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3Z"
                            fill="currentColor"
                        />
                        <path
                            d="M12 14.4L17 11.9V15.91L12 18.91L7 15.91V 11.9L12"
                            fill="white"
                        />
                    </svg>
                </div>
                <h1 className="mt-4 font-bold text-3xl text-gray-800 sm:text-4xl">Welcome to Classroom</h1>
                <p className="mt-2 text-gray-600 text-center max-w-md">Access your virtual classroom to learn, teach, and collaborate</p>
            </div>
            <div className="w-full overflow-hidden bg-white px-6 py-8 shadow-lg sm:max-w-md sm:rounded-lg border border-gray-100">
                {children}
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Classroom Learning Platform</p>
            </div>
        </div>
    );
}