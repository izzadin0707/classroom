import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import boxicons from 'boxicons';

export default function SubmissionViewer({ show, onClose, submission, isOwner, onStatusChange, auth }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(submission?.status || 'pending');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (show && submission) {
            // Fetch messages for this submission
            axios
                .get(`/submissions/${submission.id}/messages`)
                .then((response) => setMessages(response.data))
                .catch((error) => console.error(error));
            
            setSubmissionStatus(submission.status || 'pending');
        }
    }, [show, submission]);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        axios
            .post(`/submissions/${submission.id}/messages`, {
                message: newMessage
            })
            .then((response) => {
                setMessages([...messages, response.data]);
                setNewMessage('');
            })
            .catch((error) => console.error(error));
    };

    const updateSubmissionStatus = (status) => {
        axios
            .patch(`/submissions/${submission.id}`, {
                status: status
            })
            .then((response) => {
                // Update local state
                setSubmissionStatus(status);
                
                // Notify parent component
                if (onStatusChange) {
                    onStatusChange(status);
                }
                
                // Add system message
                const systemMessage = {
                    id: Date.now(),
                    user_id: null,
                    submission_id: submission.id,
                    message: `Submission marked as ${status}`,
                    is_system: true,
                    created_at: new Date().toISOString()
                };
                setMessages([...messages, systemMessage]);
            })
            .catch((error) => console.error(error));
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="4xl"
        >
            <div className="flex flex-col md:flex-row h-[80vh]">
                {/* File Viewer */}
                <div className="w-full md:w-2/3 h-full border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-medium">
                            File Submission - {submission?.users?.name}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <box-icon name="x" color="gray" size="sm"></box-icon>
                        </button>
                    </div>
                    <div className="h-[calc(100%-4rem)] overflow-hidden">
                        <iframe 
                            src={`/storage/${submission?.file_path}`} 
                            className="w-full h-full" 
                            title="Submission File"
                        />
                    </div>
                </div>

                {/* Chat and Feedback Section */}
                <div className="w-full md:w-1/3 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium mb-2">Feedback</h3>
                        
                        {isOwner && (
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm text-gray-500">Status:</span>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => updateSubmissionStatus('accepted')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            submissionStatus === 'accepted' 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => updateSubmissionStatus('revision')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            submissionStatus === 'revision' 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                    >
                                        Needs Revision
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-gray-500">
                            Submitted: {new Date(submission?.submitted_at).toLocaleString()}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No messages yet
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div 
                                    key={message.id}
                                    className={`${message.is_system 
                                        ? 'bg-gray-100 text-center py-2 rounded-md text-gray-500 text-xs' 
                                        : message.user_id === auth.id
                                            ? 'bg-blue-100 rounded-lg p-3 ml-8' 
                                            : 'bg-gray-200 rounded-lg p-3 mr-8'
                                    }`}
                                >
                                    {!message.is_system && (
                                        <div className="font-medium text-xs mb-1">
                                            {message.user?.name ?? 'Unknown'}
                                        </div>
                                    )}
                                    <div>{message.message}</div>
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {new Date(message.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                placeholder="Type your message..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 inline-flex items-center px-3 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
                            >
                                <box-icon name="send" type="solid" color="white" size="sm"></box-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}