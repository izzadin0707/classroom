import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import Class from '@/Components/Class';
import { Head, Link } from '@inertiajs/react';
import boxicons from 'boxicons';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header="Dashboard"
        >
            <Head title="Dashboard" />

            <div className="py-12">
                {/* <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div> */}
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-wrap gap-5">
                    <Class />
                    <Class title='Noteworthy technology acquisitions 2021' desciption='Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.' />
                    {/* <Link to="/"> */}
                    <Link href={route('classroom')} class="max-w-sm relative w-[100%] border-[3.5px] border-dashed border-gray-400 text-gray-400 rounded-lg shadow-sm cursor-pointer text-[3rem] transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-300">
                        {/* <a href="#">
                            <img class="rounded-t-lg aspect-video object-cover" src="https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </a> */}
                        <div class="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
                            +
                        </div>
                    </Link>
                    {/* </Link> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
