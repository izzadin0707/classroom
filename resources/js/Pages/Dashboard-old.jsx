import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import Class from '@/Components/Class';
import { Head, Link } from '@inertiajs/react';
import boxicons from 'boxicons';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Form from './Classroom/Form';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Dashboard() {
    const [confirmingClassForm, setConfirmingClassForm] = useState(false);
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
        title: '',
        password: '',
    });

    const confirmClassForm = () => {
        setConfirmingClassForm(true);
    };

    const sumbitClass = (e) => {
        e.preventDefault();

        // destroy(route('profile.destroy'), {
        //     preserveScroll: true,
        //     onSuccess: () => closeModal(),
        //     onError: () => passwordInput.current.focus(),
        //     onFinish: () => reset(),
        // });
    };

    const closeModal = () => {
        setConfirmingClassForm(false);

        clearErrors();
        reset();
    };

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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-wrap gap-5" onClick={confirmClassForm}>
                    <Class />
                    <Class title='Noteworthy technology acquisitions 2021' desciption='Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.' />
                    {/* <Link to="/"> */}
                    <div className="max-w-sm relative w-[100%] border-[3.5px] border-dashed border-gray-400 text-gray-400 rounded-lg shadow-sm cursor-pointer text-[3rem] transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-300">
                        {/* <a href="#">
                            <img className="rounded-t-lg aspect-video object-cover" src="https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </a> */}
                        <div className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
                            +
                        </div>
                    </div>
                    {/* </Link> */}
                </div>
            </div>

            <Modal show={confirmingClassForm} onClose={closeModal}>
                <form onSubmit={sumbitClass} className="mx-auto p-6">
                    <div className="mb-5">
                        <InputLabel htmlFor="classname" value="Class Title" />
                        
                        <TextInput
                            id="classname"
                            name="classname"
                            className="mt-1 block w-full text-sm"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            isFocused
                            autoComplete="classname"
                            placeholder="Your Class Title"
                        />
    
                        <InputError className="mt-2" message={errors.title} />
                        {/* <label for="title" className="block mb-2 text-sm font-medium text-gray-900">Class Title</label>
                        <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Classroom..." required /> */}
                    </div>
                    <div className="mb-5">
                        <InputLabel htmlFor="description" value="Desciption" />
                        <textarea id="description" name='description' rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Leave a description..."></textarea>
                    </div>
                    <div className='text-end'>
                        <DangerButton type="button" onClick={closeModal}>
                            Discard
                        </DangerButton>
                        <PrimaryButton className='ms-2' disabled={processing}>
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>

    );
}
