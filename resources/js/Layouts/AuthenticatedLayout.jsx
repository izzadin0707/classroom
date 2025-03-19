import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import boxicons from 'boxicons';

export default function AuthenticatedLayout({ header, backUrl = null, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-md">
                <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-3">
                    {/* Left Section */}
                    <div className="flex items-center space-x-3">
                        {/* Back Button */}
                        {backUrl && (
                            <Link
                                href={backUrl === 'history' ? '#' : route(backUrl)}
                                onClick={(e) => {
                                    if (backUrl === 'history') {
                                        e.preventDefault();
                                        window.history.back();
                                    }
                                }}
                                className="flex items-center space-x-2 hover:text-gray-600 transition"
                                aria-label="Go Back"
                            >
                                <box-icon name="chevron-left" size="sm"></box-icon>
                                <span className="text-lg font-semibold">
                                    {backUrl === 'history' ? 'Back' : 'Back to Home'}
                                </span>
                            </Link>
                        )}
                        {!backUrl && (
                            <span className="text-lg font-semibold">
                                {header}
                            </span>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-6">
                        {/* Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-md font-medium rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    {user.name}
                                    <svg
                                        className="ml-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
