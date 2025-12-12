import React, { useEffect, useState } from 'react';
import UserList from '../components/UserList';
import { getUsers, getAnalytics, deleteUser } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, analyticsRes] = await Promise.all([
                getUsers(),
                getAnalytics()
            ]);
            setUsers(usersRes.data.data);
            setAnalytics(analyticsRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                fetchData(); // Refresh both list and stats
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    // Prepare chart data if analytics exists
    const chartData = {
        labels: analytics?.byState.map(item => item._id) || [],
        datasets: [
            {
                label: 'Users by Region',
                data: analytics?.byState.map(item => item.count) || [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                    <UserList users={users} onDelete={handleDelete} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Analytics</h3>
                    {analytics?.byState.length > 0 ? (
                        <Bar options={{ responsive: true }} data={chartData} />
                    ) : (
                        <p className="text-gray-500">No data available for chart.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
