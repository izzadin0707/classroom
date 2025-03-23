import React from 'react';

export default function AssignmentView({ assignment }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Posted on {new Date(assignment.created_at).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                    </span>
                    {assignment.due_date && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Due: {formatDate(assignment.due_date)}
                        </span>
                    )}
                </div>
            </div>

            <div className="prose max-w-none text-gray-700 overflow-y-auto">
                {assignment.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-2">{paragraph}</p>
                ))}
            </div>

            {assignment.file_path && (
                <div className="pt-4">
                    <a 
                        href={`/storage/${assignment.file_path}`} 
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                        download
                    >
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Assignment
                    </a>
                </div>
            )}
        </div>
    );
}