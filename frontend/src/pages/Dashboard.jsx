import React, { useEffect, useState } from 'react';
import UserList from '../components/UserList';
import { getUsers, getAnalytics, deleteUser, notifyUser } from '../services/api';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
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
            // Fetch Users
            const usersRes = await getUsers();
            setUsers(usersRes.data.data || []);
        } catch (err) {
            // Failed to fetch users; UI will show empty state.
        }

        try {
            // Fetch Analytics (independent)
            const analyticsRes = await getAnalytics();
            setAnalytics(analyticsRes.data.data);
        } catch (err) {
            // Failed to fetch analytics; charts will show no data.
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

    const handleNotify = async (id, subject, message) => {
        try {
            await notifyUser(id, { subject, message });
            alert('Notification sent successfully!');
        } catch (err) {
            alert('Failed to send notification.');
        }
    };

    // Calculate quick stats
    const totalUsers = users.length;
    const topState = analytics?.byState?.[0]?._id || 'N/A';
    const recentUsers = users.slice(-3).map(u => u.name).join(', ');

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    // ... chartData prep ...
    const chartData = {
        labels: analytics?.byState.map(item => item._id) || [],
        datasets: [
            {
                label: 'Users per Region',
                data: analytics?.byState.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(167, 139, 250, 0.6)',
                    'rgba(236, 72, 153, 0.6)',
                    'rgba(59, 130, 246, 0.6)'
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(167, 139, 250)',
                    'rgb(236, 72, 153)',
                    'rgb(59, 130, 246)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h2>
                    <p className="text-gray-500">Welcome back, Admin</p>
                </div>
                <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    Live System
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-2xl font-bold text-gray-800">{totalUsers}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Top Region</p>
                        <h3 className="text-2xl font-bold text-gray-800">{topState}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">System Status</p>
                        <h3 className="text-lg font-bold text-green-600">Operational</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="md:col-span-2 space-y-8">
                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Region Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">User Distribution</h3>
                        {analytics?.byState.length > 0 ? (
                            <Bar
                                options={{ responsive: true, plugins: { legend: { display: false } } }}
                                data={chartData}
                            />
                        ) : (
                            <p className="text-gray-400 text-sm h-40 flex items-center justify-center">No region data</p>
                        )}
                    </div>

                    {/* Domain Chart (New!) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Email Providers</h3>
                        {analytics?.byDomain.length > 0 ? (
                            <div className="h-48 flex justify-center">
                                <Doughnut
                                    data={{
                                        labels: analytics.byDomain.map(d => d._id),
                                        datasets: [{
                                            data: analytics.byDomain.map(d => d.count),
                                            backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#64748b'],
                                            borderWidth: 0
                                        }]
                                    }}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm h-40 flex items-center justify-center">No email data</p>
                        )}
                    </div>
                </div>

                {/* Growth Chart (New!) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Growth Trend (Last 7 Days)</h3>
                    <div className="h-64">
                        <Line
                            data={{
                                labels: analytics?.growth?.map(d => d._id) || [],
                                datasets: [{
                                    label: 'New Users',
                                    data: analytics?.growth?.map(d => d.count) || [],
                                    borderColor: '#4f46e5',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    fill: true,
                                    tension: 0.4
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
                    </div>
                    <UserList users={users} onDelete={handleDelete} onNotify={handleNotify} />
                </div>
            </div>

            {/* Sidebar Stats (Top Cities) */}
            <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Top Cities</h3>
                    <div className="space-y-4">
                        {analytics?.byCity.slice(0, 5).map((city, idx) => (
                            <div key={city._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-gray-700 capitalize">{city._id}</span>
                                </div>
                                <span className="font-bold text-gray-900">{city.count}</span>
                            </div>
                        ))}
                        {(!analytics?.byCity.length) && <p className="text-gray-400 text-sm">No city data available</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
