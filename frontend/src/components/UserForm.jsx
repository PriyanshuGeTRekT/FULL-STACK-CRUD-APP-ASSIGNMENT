import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../services/api';

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        state: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await getUser(id);
            setFormData(res.data.data);
        } catch (err) {
            setError('Failed to fetch user data');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await updateUser(id, formData);
            } else {
                await createUser(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {isEditMode ? 'Edit User' : 'Add New User'}
            </h2>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full text-gray-600 py-2 hover:underline"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default UserForm;
