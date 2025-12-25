import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Employer Dashboard
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Link
                        to="/post-job"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Post a New Job
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {jobs.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                        <p className="text-gray-500 text-lg">You haven't posted any jobs yet.</p>
                        <Link to="/post-job" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                            Post your first job &rarr;
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <li key={job._id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{job.title}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {job.isUrgent ? 'Urgent' : 'Active'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {job.category}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {job.location}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm1 2h6v1H7V4zm0 2v2h6V6H7zm-2 2v2h2V8H5zm8 0v2h2V8h-2zm-8 4v2h2v-2H5zm8 0v2h2v-2h-2z" clipRule="evenodd" />
                                            </svg>
                                            <p>
                                                Posted on <time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
