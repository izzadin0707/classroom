import React from 'react';

export default function MaterialView({ material }) {
    return (
        <div className="space-y-4 py-3">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">{material.title}</h3>
                <p className="text-sm text-gray-500">
                    Added on {new Date(material.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </p>
            </div>

            <div className="prose max-w-none text-gray-700 overflow-y-auto">
                {material.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-2">{paragraph}</p>
                ))}
            </div>

            {material.file_path && (
                <div className="pt-4">
                    <a 
                        href={`/storage/${material.file_path}`} 
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                        download
                    >
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Material
                    </a>
                </div>
            )}
        </div>
    );
}