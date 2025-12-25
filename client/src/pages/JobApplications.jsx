import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCheck, FaTimes, FaArrowLeft, FaFileAlt, FaBriefcase, FaLock } from 'react-icons/fa';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch applications and Job Details to check status
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Parallel fetch
                const [appRes, jobRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/applications/job/${jobId}`, config),
                    axios.get(`http://localhost:5000/api/jobs/${jobId}`, config) // We can use the public endpoint for this or specific one
                ]);

                console.log("Frontend received applications:", appRes.data);
                setApplications(appRes.data);
                setJob(jobRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load applications.");
                setLoading(false);
            }
        };

        if (token && jobId) {
            fetchData();
        }
    }, [jobId, token]);


    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus }, config);

            // Optimistically update UI
            const updatedApps = applications.map(app =>
                app._id === id ? { ...app, status: newStatus } : app
            );
            setApplications(updatedApps);

            // If accepted, also locally update job status to Closed to disable other buttons immediately
            if (newStatus === 'Accepted') {
                setJob(prev => ({ ...prev, status: 'Closed' }));
            }

        } catch (err) {
            console.error("Error updating status", err);
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/employer/dashboard')} className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Job Applications <span className="text-gray-400 text-lg ml-2">({applications.length})</span>
                        </h2>
                        <p className="text-gray-500 mt-1 flex items-center">
                            For: <span className="font-semibold text-gray-700 ml-1">{job?.title}</span>
                            {job?.status === 'Closed' && (
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <FaLock className="mr-1" /> Position Closed
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-200">
                        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400 text-2xl">
                            <FaUser />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-500">Wait for candidates to apply for this position.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                            >
                                <div className="md:flex">
                                    {/* Candidate Info Column */}
                                    <div className="p-8 md:w-1/3 bg-gray-50 border-r border-gray-100">
                                        <div className="flex items-center mb-6">
                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md mr-4">
                                                {app.applicant?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    {app.applicant?.name || 'Unknown Candidate'}
                                                </h3>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${app.status === 'Accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                                                            app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-sm text-gray-600">
                                            <div className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-indigo-300 transition-colors">
                                                    <FaEnvelope className="text-gray-400 group-hover:text-indigo-500" />
                                                </div>
                                                <a href={`mailto:${app.applicant?.email}`} className="truncate hover:text-indigo-600 transition-colors">
                                                    {app.applicant?.email || 'N/A'}
                                                </a>
                                            </div>
                                            <div className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-indigo-300 transition-colors">
                                                    <FaPhone className="text-gray-400 group-hover:text-indigo-500" />
                                                </div>
                                                <span>{app.applicant?.phone || 'No phone provided'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Application Content Column */}
                                    <div className="p-8 md:w-2/3 flex flex-col">
                                        <div className="flex-grow">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                                <FaFileAlt className="mr-2" /> Cover Letter
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                                {app.coverLetter}
                                            </div>
                                        </div>

                                        {/* Actions Footer */}
                                        {app.status === 'Pending' ? (
                                            job?.status === 'Closed' ? (
                                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg p-4">
                                                    <FaLock className="mr-2" /> This job is closed. No further actions can be taken.
                                                </div>
                                            ) : (
                                                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
                                                    >
                                                        <FaCheck className="mr-2" /> Accept Application
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                        className="flex-1 bg-white border-2 border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
                                                    >
                                                        <FaTimes className="mr-2" /> Reject
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end items-center text-sm text-gray-500 italic">
                                                {app.status === 'Accepted' && (
                                                    <span className="flex items-center text-green-600 font-medium">
                                                        <FaCheck className="mr-1" /> Accepted on {new Date().toLocaleDateString()}
                                                    </span>
                                                )}
                                                {app.status === 'Rejected' && (
                                                    <span className="flex items-center text-red-500 font-medium">
                                                        <FaTimes className="mr-1" /> Rejected on {new Date().toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;
