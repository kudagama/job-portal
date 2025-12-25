import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPlus, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaBolt, FaExclamationCircle } from 'react-icons/fa';

const EmployerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const urgentCount = jobs.filter(j => j.isUrgent).length;
    const activeCount = jobs.length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
                        <p className="mt-1 text-gray-500">Manage your posted jobs and track applications.</p>
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
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                            <FaBriefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Jobs Posted</p>
                            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                            <FaCheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center"
                    >
                        <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                            <FaBolt className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Urgent Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Jobs List */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-900">Your Posted Jobs</h3>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <FaBriefcase className="h-full w-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No jobs posted</h3>
                            <p className="mt-1 text-gray-500">Get started by creating a new job posting.</p>
                            <div className="mt-6">
                                <Link
                                    to="/post-job"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    Post Job
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {jobs.map((job) => (
                                <motion.li
                                    key={job._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <div className="px-6 py-5 sm:px-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <p className="text-lg font-semibold text-indigo-600 truncate mr-3">
                                                    {job.title}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {job.isUrgent ? <><FaBolt className="mr-1" /> Urgent</> : <><FaCheckCircle className="mr-1" /> Active</>}
                                                </span>
                                            </div>
                                            <div className="flex-shrink-0 flex">
                                                <p className="text-sm text-gray-500">
                                                    Rs. {job.budget} • {job.budgetType}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="sm:flex sm:justify-between">
                                            <div className="sm:flex gap-6">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <FaBriefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    {job.category}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    {job.location}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>
                                                    Posted on <time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 border-t border-gray-100 pt-4 flex justify-end">
                                            <Link
                                                to={`/job-applications/${job._id}`}
                                                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                View Applications &rarr;
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
