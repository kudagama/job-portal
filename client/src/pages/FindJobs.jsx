import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaMoneyBillWave, FaClock, FaBriefcase, FaBolt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

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

    const handleViewDetails = (jobId) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/jobs/${jobId}`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center sm:text-left"
                >
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                        <FaBriefcase className="text-indigo-600" />
                        Find Tasks & Gigs
                    </h1>
                    <p className="text-gray-600 mt-2">Browse through hundreds of available service requests</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full lg:w-1/4 space-y-6"
                    >

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <FaFilter className="text-indigo-500" /> Filters
                            </h3>

                            {/* Urgency Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Urgency</h4>
                                <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
                                    <input
                                        type="checkbox"
                                        checked={filters.isUrgent}
                                        onChange={handleUrgentChange}
                                        className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700 font-medium group-hover:text-red-700 transition-colors text-sm">Urgent Tasks Only</span>
                                </label>
                            </div>

                            {/* Budget Type Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Type</h4>
                                <div className="space-y-2">
                                    {['Fixed', 'Daily'].map((type) => (
                                        <label key={type} className={`flex items-center space-x-3 cursor-pointer group p-2 rounded-lg transition-colors border ${filters.budgetType === type ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                checked={filters.budgetType === type}
                                                onChange={() => handleFilterChange('budgetType', type)}
                                                className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className={`text-sm ${filters.budgetType === type ? 'text-indigo-700 font-medium' : 'text-gray-700 group-hover:text-indigo-600'}`}>{type === 'Fixed' ? 'Fixed Price' : 'Daily Wage'}</span>
                                        </label>
                                    ))}
                                    <label className={`flex items-center space-x-3 cursor-pointer group p-2 rounded-lg transition-colors border ${filters.budgetType === '' ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="budgetType"
                                            checked={filters.budgetType === ''}
                                            onChange={() => setFilters(prev => ({ ...prev, budgetType: '' }))}
                                            className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className={`text-sm ${filters.budgetType === '' ? 'text-indigo-700 font-medium' : 'text-gray-700 group-hover:text-indigo-600'}`}>All Types</span>
                                    </label>
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Location</h4>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter city..."
                                        value={filters.location}
                                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content - Job List */}
                    <div className="w-full lg:w-3/4">
                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative mb-8"
                        >
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title, description, or keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl shadow-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </motion.div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <div className="mt-2 text-indigo-600 font-medium">Finding perfect matches...</div>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {jobs.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="text-gray-400 text-6xl mb-4 flex justify-center"><FaSearch /></div>
                                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                                        <p className="text-gray-500 mt-1 mb-6">Try adjusting your filters or search query.</p>
                                        <button
                                            onClick={() => { setKeyword(''); setFilters({ budgetType: '', isUrgent: false, location: '' }) }}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                ) : (
                                    jobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                {/* Icon */}
                                                <div className="flex-shrink-0">
                                                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                        {job.category ? job.category.charAt(0) : 'T'}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow">
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                                        <div>
                                                            <button
                                                                onClick={() => handleViewDetails(job._id)}
                                                                className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 text-left"
                                                            >
                                                                {job.title}
                                                            </button>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                                <span className="font-medium text-indigo-600">{job.category}</span>
                                                                <span>•</span>
                                                                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {job.isUrgent && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                                    <FaBolt className="mr-1" /> Urgent
                                                                </span>
                                                            )}
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${job.budgetType === 'Fixed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                                {job.budgetType === 'Fixed' ? 'Fixed Price' : 'Daily Wage'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                        {job.description}
                                                    </p>

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-50 gap-4">
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <FaMapMarkerAlt className="mr-1.5 text-gray-400" />
                                                                {job.location || 'Remote'}
                                                            </div>
                                                            <div className="flex items-center font-medium text-gray-700">
                                                                <FaMoneyBillWave className="mr-1.5 text-green-500" />
                                                                Rs. {job.budget}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleViewDetails(job._id)}
                                                            className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
