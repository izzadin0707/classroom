import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import { Head, Link } from '@inertiajs/react';
import boxicons from 'boxicons';

export default function Index() {
    return (
        <AuthenticatedLayout
            header="Classroom"
        >
            <Head title="Classroom" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-5">
                        
                        <form class="mx-auto">
                            <div class="mb-5">
                                <label for="title" class="block mb-2 text-sm font-medium text-gray-900">Class Title</label>
                                <input type="text" id="title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Classroom..." required />
                            </div>
                            <div class="mb-5">
                                <label for="desciption" class="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                <textarea id="desciption" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Leave a description..."></textarea>
                            </div>
                            <div className='text-end'>
                                <Link href={route('dashboard')}>
                                <button type="button" class="text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mr-2">Discard</button>
                                </Link>
                                <button type="submit" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Save</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
