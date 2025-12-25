import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters State
    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState({
        budgetType: '',
        isUrgent: false,
        location: ''
    });

    // Debounce search
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [keyword]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (debouncedKeyword) queryParams.append('keyword', debouncedKeyword);
                if (filters.budgetType) queryParams.append('budgetType', filters.budgetType);
                if (filters.isUrgent) queryParams.append('isUrgent', 'true');
                if (filters.location) queryParams.append('location', filters.location);

                const res = await axios.get(`http://localhost:5000/api/jobs?${queryParams.toString()}`);
                setJobs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs. Please try again later.");
                setLoading(false);
            }
        };

        fetchJobs();
    }, [debouncedKeyword, filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: prev[field] === value ? '' : value // Toggle if clicking same value, else set new
        }));
    };

    const handleUrgentChange = () => {
        setFilters(prev => ({ ...prev, isUrgent: !prev.isUrgent }));
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Tasks</h1>
                    <p className="text-gray-600 mt-2">Browse through available service requests and gigs</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full md:w-1/4 space-y-6">

                        {/* Urgency Filter */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Urgency</h3>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.isUrgent}
                                    onChange={handleUrgentChange}
                                    className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors text-sm">Urgent Tasks Only</span>
                            </label>
                        </div>

                        {/* Budget Type Filter */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Payment Type</h3>
                            <div className="space-y-2">
                                {['Fixed', 'Daily'].map((type) => (
                                    <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="budgetType"
                                            checked={filters.budgetType === type}
                                            onChange={() => handleFilterChange('budgetType', type)}
                                            className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-700 group-hover:text-indigo-600 transition-colors text-sm">{type === 'Fixed' ? 'Fixed Price' : 'Daily Wage'}</span>
                                    </label>
                                ))}
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="budgetType"
                                        checked={filters.budgetType === ''}
                                        onChange={() => setFilters(prev => ({ ...prev, budgetType: '' }))}
                                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors text-sm">All Types</span>
                                </label>
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Enter location..."
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Job List */}
                    <div className="w-full md:w-3/4">
                        {/* Search Bar */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center bg-indigo-50/50">
                            <div className="relative w-full mb-0">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by title, description, or keywords..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10">
                                <div className="text-indigo-600 font-medium">Updating results...</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.length === 0 ? (
                                    <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                                        <div className="text-gray-500 text-lg mb-2">No tasks found matching your criteria.</div>
                                        <button onClick={() => { setKeyword(''); setFilters({ budgetType: '', isUrgent: false, location: '' }) }} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                            Clear all filters
                                        </button>
                                    </div>
                                ) : (
                                    jobs.map((job) => (
                                        <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                            {/* Logo Placeholder */}
                                            <div className="flex-shrink-0">
                                                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                                    {job.category ? job.category.charAt(0) : 'T'}
                                                </div>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-grow">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                    <div>
                                                        <Link to={`/jobs/${job._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer block mb-1">
                                                            {job.title}
                                                        </Link>
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                                                                {job.category}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {job.contactPhone ? `• Verified User` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.budgetType === 'Fixed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                            {job.budgetType === 'Fixed' ? 'Fixed Price' : 'Daily Wage'}
                                                        </span>
                                                        {job.isUrgent && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                                                Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3 mt-3">
                                                    <div className="flex items-center">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {job.location || 'Remote'}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Rs. {job.budget}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(job.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-50">
                                                    <Link to={`/jobs/${job._id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors shadow-sm">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
