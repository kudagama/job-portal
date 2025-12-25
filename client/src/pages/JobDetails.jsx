import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load job details. The job may not exist.');
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 font-semibold">Loading task details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-red-600 font-semibold">{error}</div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Header Breadcrumb */}
                <div className="mb-6">
                    <Link to="/find-jobs" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Tasks
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Job Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="h-20 w-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0">
                                    {job.category ? job.category.charAt(0) : 'T'}
                                </div>
                                <div className="flex-grow">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                        <span className="flex items-center font-medium text-gray-900">
                                            {job.contactPhone || 'Verified User'}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {job.isUrgent && (
                                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Urgent</span>
                                        )}
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{job.budgetType}</span>
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">{job.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Task Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">

                        {/* Action Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-1">Interested in this task?</h3>
                            <p className="text-sm text-gray-500 mb-6">Contact the poster directly or apply here.</p>

                            {job.contactPhone && (
                                <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                                    <p className="text-xs text-green-700 uppercase font-semibold">Call Directly</p>
                                    <p className="text-lg font-bold text-green-800">{job.contactPhone}</p>
                                </div>
                            )}

                            <button className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mb-3">
                                Apply Now / Message
                            </button>
                            <button className="w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                                Save Task
                            </button>
                        </div>

                        {/* Job Summary Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Task Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Budget</p>
                                        <p className="font-medium text-gray-900">Rs. {job.budget}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Task Type</p>
                                        <p className="font-medium text-gray-900">{job.budgetType}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                        <p className="font-medium text-gray-900">{job.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
