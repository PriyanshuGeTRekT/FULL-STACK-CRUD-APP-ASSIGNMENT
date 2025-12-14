import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ users, onDelete, onNotify }) => {
    const [notifyState, setNotifyState] = useState({ open: false, userId: null, subject: '', message: '' });

    const openNotify = (userId) => setNotifyState({ open: true, userId, subject: '', message: '' });
    const closeNotify = () => setNotifyState({ open: false, userId: null, subject: '', message: '' });
    const handleSendNotify = async () => {
        if (!notifyState.subject || !notifyState.message) return;
        await onNotify(notifyState.userId, notifyState.subject, notifyState.message);
        closeNotify();
    };
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                    <p className="text-sm text-gray-500">Manage your users and their details</p>
                </div>
                <Link
                    to="/users/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 font-medium"
                >
                    + Add New User
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="py-4 px-6 font-semibold">Name</th>
                            <th className="py-4 px-6 font-semibold">Email</th>
                            <th className="py-4 px-6 font-semibold">Location</th>
                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-4 px-6 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {user.city}, {user.state}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right space-x-3">
                                    <button
                                        onClick={() => openNotify(user._id)}
                                        className="text-green-600 hover:text-green-900 font-medium text-sm hover:underline"
                                    >
                                        Notify
                                    </button>
                                    <Link
                                        to={`/users/${user._id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => onDelete(user._id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                            {notifyState.open && (
                                <tr>
                                    <td colSpan="4" className="bg-gray-50 p-4">
                                        <div className="max-w-xl mx-auto">
                                            <h4 className="font-medium mb-2">Send Notification</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                <input
                                                    placeholder="Subject"
                                                    value={notifyState.subject}
                                                    onChange={(e) => setNotifyState(s => ({ ...s, subject: e.target.value }))}
                                                    className="w-full border p-2 rounded"
                                                />
                                                <textarea
                                                    placeholder="Message"
                                                    value={notifyState.message}
                                                    onChange={(e) => setNotifyState(s => ({ ...s, message: e.target.value }))}
                                                    className="w-full border p-2 rounded"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={closeNotify} className="text-gray-600">Cancel</button>
                                                    <button onClick={handleSendNotify} className="bg-green-600 text-white px-3 py-1 rounded">Send</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-12 text-gray-400">
                                    <p className="text-lg">No users found.</p>
                                    <p className="text-sm">Get started by creating a new user.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
