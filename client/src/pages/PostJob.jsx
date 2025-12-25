import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
    const navigate = useNavigate();
    const { user, token, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else if (user.role !== 'employer') {
                navigate('/');
            }
        }
    }, [user, authLoading, navigate]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        budget: '',
        budgetType: 'Fixed',
        location: '',
        contactPhone: '',
        isUrgent: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Construction', 'Cleaning', 'Electrical', 'Plumbing', 'Transport', 'Masonry', 'Gardening', 'Other'];

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post('http://localhost:5000/api/jobs', formData, config);
            alert('Service request posted successfully!');
            navigate('/employer/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 border border-gray-100">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Post a Service Request</h2>
                        <p className="mt-2 text-sm text-gray-600">Fill in the details to find the right expert for your task.</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Fix Leaking Tap"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                rows="4"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the work in detail..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Budget Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (Rs.)</label>
                                <input
                                    type="number"
                                    name="budget"
                                    id="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g., 500"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700">Budget Type</label>
                                <select
                                    name="budgetType"
                                    id="budgetType"
                                    value={formData.budgetType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Fixed">Fixed Price</option>
                                    <option value="Daily">Daily Wage</option>
                                </select>
                            </div>
                        </div>

                        {/* Location & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Indiranagar, Bangalore"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    id="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    placeholder="e.g., 9876543210"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Urgent Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="isUrgent"
                                name="isUrgent"
                                type="checkbox"
                                checked={formData.isUrgent}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">
                                This task is urgent
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Posting...' : 'Post Service Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
