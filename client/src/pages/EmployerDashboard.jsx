import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPlus, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaBolt, FaExclamationCircle, FaCheckDouble, FaSpinner } from 'react-icons/fa';

const EmployerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('active');

    const activeJobs = jobs.filter(j => j.status !== 'Closed');
    const doneJobs = jobs.filter(j => j.status === 'Closed');

    const filteredJobs = filter === 'active' ? activeJobs : doneJobs;

    const urgentCount = activeJobs.filter(j => j.isUrgent).length;
    const activeCount = activeJobs.length;

    useEffect(() => {
        if (!user || user.role !== 'employer') {
            navigate('/');
            return;
        }

        const fetchMyJobs = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const res = await axios.get('http://localhost:5000/api/jobs/my-jobs', config);
                setJobs(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, [user, navigate, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r-md shadow-sm">
                    <div className="flex">
                        <FaExclamationCircle className="h-5 w-5 mr-2" />
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
                        <p className="mt-1 text-sm md:text-base text-gray-500 dark:text-gray-400">Manage your posted jobs and track applications.</p>
                    </div>
                    <Link
                        to="/post-job"
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus className="mr-2" /> Post New Job
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-4">
                            <FaBriefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs Posted</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                            <FaCheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
                            <FaBolt className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Urgent Jobs</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{urgentCount}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Jobs Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Posted Jobs</h3>

                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'active'
                                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Active Jobs ({activeJobs.length})
                            </button>
                            <button
                                onClick={() => setFilter('done')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'done'
                                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                History ({doneJobs.length})
                            </button>
                        </div>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
                                <FaBriefcase className="h-full w-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No {filter === 'active' ? 'active' : 'completed'} jobs found</h3>
                            {filter === 'active' && (
                                <>
                                    <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new job posting.</p>
                                    <div className="mt-6">
                                        <Link
                                            to="/post-job"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            Post Job
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredJobs.map((job) => (
                                <motion.li
                                    key={job._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                                >
                                    <div className="px-6 py-5 sm:px-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 truncate mr-3">
                                                    {job.title}
                                                </p>
                                                {job.status === 'Closed' ? (
                                                    job.detailedStatus === 'Finished' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                            <FaCheckDouble className="mr-1" /> Finished
                                                        </span>
                                                    ) : job.detailedStatus === 'In Progress' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                            <FaSpinner className="mr-1 animate-spin" /> In Progress
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                            <FaCheckCircle className="mr-1" /> Closed
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.isUrgent ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                        {job.isUrgent ? <><FaBolt className="mr-1" /> Urgent</> : <><FaCheckCircle className="mr-1" /> Active</>}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 flex">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Rs. {job.budget} • {job.budgetType}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="sm:flex sm:justify-between">
                                            <div className="sm:flex gap-6">
                                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <FaBriefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                    {job.category}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                                    <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                    {job.location}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <p>
                                                    Posted on <time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-end">
                                            <Link
                                                to={`/job-applications/${job._id}`}
                                                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                            >
                                                View {job.status === 'Closed' ? 'Details' : 'Applications'} &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
