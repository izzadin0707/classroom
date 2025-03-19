import Dropdown from '@/Components/Dropdown';

export default function Class({
    title="Example",
    desciption="This is Desciption"
}) {
    return (
        <div className="max-w-sm relative bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className='absolute right-0'>
                <div className="relative ms-3">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-md font-medium leading-4 text-black transition duration-150 ease-in-out hover:text-gray-800 focus:outline-none"
                            >
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                </svg>
                            </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content width='w-32'>
                            <Dropdown.Link
                                href={route('profile.edit')}
                                className = 'text-red-500'
                            >
                                Leave
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
            <a href="#">
                <img className="rounded-t-lg aspect-video object-cover" src="https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </a>
            <div className="p-5">
                <div className="mb-10">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700">{desciption}</p>
                </div>
                <a href="#" className="absolute bottom-0 right-0 m-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center transition-all text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Go to Class
                </a>
            </div>
        </div>
    )
}