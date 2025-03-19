import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome to Classroom" />
            <div className="bg-gray-50 text-gray-800">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
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
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-blue-500"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-4 py-2 text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-blue-500 mr-2"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-4 py-2 text-white bg-blue-600 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-blue-500"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-10 mb-20">
                            {/* Hero Section */}
                            <div className="text-center mb-16">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4 lg:text-5xl">Welcome to Classroom</h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    A powerful learning management system to connect teachers and students in a collaborative online environment.
                                </p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                {/* Features Card */}
                                <div className="flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-200 lg:p-8">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <svg
                                            className="size-6 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Create Classes
                                        </h2>

                                        <p className="mt-4 text-gray-600">
                                            Teachers can create virtual classrooms, invite students, and organize learning materials. Students can join classes with a simple code.
                                        </p>
                                    </div>
                                </div>

                                {/* Assignments Card */}
                                <div className="flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-200 lg:p-8">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <svg
                                            className="size-6 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Manage Assignments
                                        </h2>

                                        <p className="mt-4 text-gray-600">
                                            Create, distribute, and grade assignments easily. Students can submit their work digitally and receive feedback all in one place.
                                        </p>
                                    </div>
                                </div>

                                {/* Communication Card */}
                                <div className="flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-200 lg:p-8">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <svg
                                            className="size-6 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Class Discussions
                                        </h2>

                                        <p className="mt-4 text-gray-600">
                                            Foster collaboration with class discussions, announcements, and comments. Keep everyone engaged and connected.
                                        </p>
                                    </div>
                                </div>

                                {/* Resources Card */}
                                <div className="flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-200 lg:p-8">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <svg
                                            className="size-6 text-blue-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Learning Resources
                                        </h2>

                                        <p className="mt-4 text-gray-600">
                                            Share files, videos, links and learning materials with your class. Organize resources by topic or unit for easy access.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-12 text-center">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-blue-500"
                                >
                                    Get Started Today
                                </Link>
                            </div>
                        </main>

                        <footer className="py-8 text-center text-sm text-gray-600 border-t border-gray-200">
                            <p>Classroom © {new Date().getFullYear()} | Powered by Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}