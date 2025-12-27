import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaPhoneAlt, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaTag, FaBriefcase, FaUserCheck } from 'react-icons/fa';

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/find-jobs" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Jobs
                </Link>
            </div>
        );
    }

    if (!job) return null;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 font-sans text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/find-jobs" className="text-indigo-200 hover:text-white font-medium inline-flex items-center mb-8 transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to Tasks
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                    >
                        <div>
                            <div className="flex gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium border border-white/10 flex items-center">
                                    <FaBriefcase className="mr-2 text-indigo-200" /> {job.category}
                                </span>
                                {job.isUrgent && (
                                    <span className="px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-sm text-sm font-medium border border-red-500/30 text-red-100 flex items-center">
                                        <FaExclamationCircle className="mr-2" /> Urgent
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{job.title}</h1>
                            <div className="flex flex-wrap gap-6 text-indigo-100 text-sm md:text-base">
                                <span className="flex items-center">
                                    <FaMapMarkerAlt className="mr-2" /> {job.location}
                                </span>
                                <span className="flex items-center">
                                    <FaCalendarAlt className="mr-2" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-[200px]">
                            <p className="text-indigo-200 text-sm font-medium mb-1">Budget</p>
                            <p className="text-3xl font-bold text-white flex items-center">
                                <span className="text-2xl mr-1">Rs.</span> {job.budget}
                            </p>
                            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-wide opacity-80">{job.budgetType}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Left Side */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Job Description */}
                        <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <FaTag className="mr-3 text-indigo-500" /> Task Description
                            </h2>
                            <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-8">
                            <h3 className="text-indigo-900 dark:text-indigo-300 font-bold mb-2">Safety Tip</h3>
                            <p className="text-indigo-700 dark:text-indigo-400 text-sm">
                                Always discuss the full details of the task and payment terms before starting work. Keep communications within the platform when possible.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Sidebar - Right Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Action Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Interested?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Contact the poster to get this job.</p>

                            {job.contactPhone ? (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 flex items-center justify-between group cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                    <div>
                                        <p className="text-xs text-green-700 dark:text-green-400 uppercase font-bold tracking-wider mb-1">Call Now</p>
                                        <p className="text-xl font-bold text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200">{job.contactPhone}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-green-200 dark:bg-green-800/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-300">
                                        <FaPhoneAlt />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm italic">
                                    Phone number hidden by user
                                </div>
                            )}

                            <Link
                                to={`/apply/${job._id}`}
                                className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mb-4 flex items-center justify-center"
                            >
                                <FaCheckCircle className="mr-2" /> Apply Now
                            </Link>

                            <div className="text-center">
                                <p className="text-xs text-gray-400 mt-4">
                                    <FaUserCheck className="inline mr-1" />
                                    Verified Poster
                                </p>
                            </div>
                        </div>

                        {/* Job Summary Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">Task Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 w-8">
                                        <FaMoneyBillWave className="text-indigo-500 text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Budget</p>
                                        <p className="font-medium text-gray-900 dark:text-white">Rs. {job.budget}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 w-8">
                                        <FaBriefcase className="text-indigo-500 text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Type</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{job.budgetType}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 w-8">
                                        <FaMapMarkerAlt className="text-indigo-500 text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Location</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
