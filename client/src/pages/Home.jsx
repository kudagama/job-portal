import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                // Get latest 6 jobs
                setFeaturedJobs(res.data.slice(0, 6));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const jobCategories = [
        { name: 'Home Repairs', jobs: '20+ Tasks' },
        { name: 'Cleaning', jobs: '15+ Tasks' },
        { name: 'Electrical', jobs: '10+ Tasks' },
        { name: 'Plumbing', jobs: '8+ Tasks' },
        { name: 'Moving', jobs: '12+ Tasks' },
        { name: 'Painting', jobs: '5+ Tasks' },
        { name: 'Construction', jobs: '18+ Tasks' },
        { name: 'Gardening', jobs: '7+ Tasks' },
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Find Local <span className="text-yellow-300">Service Experts</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Connect with skilled workers in your area for plumbing, electrical, cleaning, and more.
                    </p>

                    <div className="bg-white p-2 rounded-lg shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                className="w-full pl-10 pr-4 py-3 border-none rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="relative flex-grow md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Pincode or City"
                                className="w-full pl-10 pr-4 py-3 border-none rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-md hover:bg-indigo-700 transition duration-300 shadow-md">
                            Search
                        </button>
                    </div>

                    <div className="mt-6 text-sm text-indigo-200">
                        Popular: <span className="underline cursor-pointer hover:text-white">Plumber</span>, <span className="underline cursor-pointer hover:text-white">Electrician</span>, <span className="underline cursor-pointer hover:text-white">House Cleaning</span>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Find the job that fits your skills and interests from our wide range of categories.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {jobCategories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{category.jobs}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Tasks</h2>
                            <p className="text-gray-600">Recently posted service requests</p>
                        </div>
                        <Link to="/find-jobs" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors hidden sm:inline-block">
                            View all tasks &rarr;
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-indigo-600">Loading latest tasks...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredJobs.length === 0 ? (
                                <div className="col-span-3 text-center text-gray-500 py-10">
                                    No tasks available right now. Be the first to post one!
                                </div>
                            ) : (
                                featuredJobs.map((job) => (
                                    <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                        <div className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-md">
                                                    {job.category ? job.category.charAt(0) : 'T'}
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${job.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {job.isUrgent ? 'Urgent' : job.budgetType}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                                                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                                            </h3>
                                            <div className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                                    {job.category}
                                                </span>
                                                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                                    {job.location}
                                                </span>
                                            </div>

                                            <div className="text-sm font-medium text-gray-900">
                                                Rs. {job.budget}
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 rounded-b-xl">
                                            <Link to={`/jobs/${job._id}`} className="block w-full text-center bg-white text-indigo-600 border border-indigo-200 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-300">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/find-jobs" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                            View all tasks &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
