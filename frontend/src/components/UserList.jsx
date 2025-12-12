import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ users, onDelete }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Users ({users.length})</h2>
                <Link
                    to="/users/new"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add User
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">City</th>
                            <th className="py-2 px-4">State</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.city}</td>
                                <td className="py-2 px-4">{user.state}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <Link
                                        to={`/users/${user._id}/edit`}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => onDelete(user._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No users found.
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
