import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Candidate Dashboard
                </h2>
                <p className="mt-2 text-sm text-gray-500">Welcome back, {user?.name}. Here are the latest tasks for you.</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="text-indigo-600 font-medium">Loading tasks...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded-xs text-xs font-medium ${job.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {job.isUrgent ? 'Urgent' : 'Active'}
                                </span>
                                <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                                {job.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-900">Rs. {job.budget}</span>
                                <Link to={`/jobs/${job._id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
