import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // Import Language Hook
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBriefcase, FaBolt, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaArrowRight, FaPaperPlane, FaClock, FaCheckCircle, FaTimesCircle, FaLock, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';

const CandidateDashboard = () => {
    const { t } = useLanguage(); // Get translations
    const { user, token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch All Jobs for recommendations
                const jobsRes = await axios.get('http://localhost:5000/api/jobs');
                setJobs(jobsRes.data);

                // Fetch My Applications
                if (token) {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const appsRes = await axios.get('http://localhost:5000/api/applications/my-applications', config);
                    setMyApplications(appsRes.data);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const getStatusBadge = (app) => {
        const { status, job } = app;

        if (status === 'Accepted') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"><FaCheckCircle className="mr-1" /> {t.dashboard?.accepted || 'Accepted'} 🎉</span>;
        }

        if (status === 'Rejected') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"><FaTimesCircle className="mr-1" /> {t.dashboard?.rejected || 'Rejected'}</span>;
        }

        if (status === 'Pending') {
            if (job?.status === 'Closed') {
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"><FaLock className="mr-1" /> {t.dashboard?.filled || 'Position Filled'} 😔</span>;
            }
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"><FaClock className="mr-1" /> {t.dashboard?.pending || 'Pending'}</span>;
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-12 relative"
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500 opacity-30 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500 opacity-30 blur-3xl"></div>

                    <div className="relative z-10 px-8 py-12 md:flex md:items-center md:justify-between">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                                {t.dashboard.candidate.welcomeBack}, {user?.name}!
                            </h2>
                            <p className="mt-4 text-lg text-indigo-100 max-w-3xl">
                                {t.dashboard.candidate.subTitle}
                            </p>
                        </div>
                        <div className="mt-8 md:mt-0 md:w-1/3 flex justify-end gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[100px]">
                                <span className="block text-3xl font-bold text-white mb-1">{myApplications.length}</span>
                                <span className="text-sm text-indigo-200">{t.dashboard.candidate.statsApplied}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[100px]">
                                <span className="block text-3xl font-bold text-white mb-1">{jobs.length}</span>
                                <span className="text-sm text-indigo-200">{t.dashboard.candidate.statsActive}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* My Applications Section */}
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                        <FaPaperPlane className="mr-2 text-indigo-500" /> {t.dashboard.candidate.myApps}
                    </h3>

                    {myApplications.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                            {t.dashboard.candidate.noApps}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myApplications.map((app) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2 w-3/4" title={app.job?.title}>{app.job?.title || t.dashboard.candidate.jobUnavailable}</h4>
                                            <div className="flex-shrink-0">
                                                {getStatusBadge(app)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                                            <FaBriefcase className="mr-2 text-gray-300 dark:text-gray-600" /> {app.job?.category || 'General'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-gray-300 dark:text-gray-600" /> {t.dashboard.candidate.appliedDate} {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {app.status === 'Accepted' && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="w-full text-sm text-green-700 dark:text-green-300 font-bold bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 p-3 rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <FaPhone className="mr-2" /> {t.dashboard.candidate.showContact}
                                            </button>
                                        </div>
                                    )}

                                    {/* Show specific message if job is closed but user wasn't rejected explicitly yet */}
                                    {app.status === 'Pending' && app.job?.status === 'Closed' && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center">
                                                <FaLock className="mr-2" /> {t.dashboard.candidate.someoneElse}
                                            </p>
                                        </div>
                                    )}

                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended Jobs Section */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FaBriefcase className="mr-2 text-indigo-500" /> {t.dashboard.candidate.recommended}
                    </h3>
                    <Link to="/find-jobs" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center text-sm">
                        {t.dashboard.candidate.viewAll} <FaArrowRight className="ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <div className="mt-4 text-indigo-600 font-medium">{t.dashboard.candidate.loadingRecs}</div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {jobs.map((job) => (
                            <motion.div
                                key={job._id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {job.category ? job.category.charAt(0) : 'T'}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {job.isUrgent && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-1">
                                                    <FaBolt className="mr-1" /> {t.jobDetails?.urgent || 'Urgent'}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {job.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">{job.category}</span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">{job.budgetType}</span>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                        {job.description}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <FaMapMarkerAlt className="mr-2 text-gray-400 dark:text-gray-500" /> {job.location}
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                                        <span className="text-gray-400 dark:text-gray-500 font-normal mr-2">{t.jobDetails?.budget || 'Budget'}:</span> Rs. {job.budget}
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-50 dark:border-gray-700 rounded-b-xl flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {/* Fake avatars for "applicants" effect */}
                                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white dark:border-gray-700"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white dark:border-gray-700"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500">+3</div>
                                    </div>
                                    <Link to={`/jobs/${job._id}`} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center">
                                        {t.findJobs?.viewDetails || 'View Details'} <FaArrowRight className="ml-1 text-xs" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Contact Details Modal */}
                <AnimatePresence>
                    {selectedApp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                            onClick={() => setSelectedApp(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                                    <h3 className="text-xl font-bold">{t.dashboard.candidate.modalTitle}</h3>
                                    <button onClick={() => setSelectedApp(null)} className="text-indigo-100 hover:text-white transition-colors">
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold mb-4 overflow-hidden border-2 border-indigo-200 dark:border-indigo-700">
                                            {selectedApp.job.createdBy?.profilePicture ? (
                                                <img src={selectedApp.job.createdBy.profilePicture} alt="Employer" className="h-full w-full object-cover" />
                                            ) : (
                                                selectedApp.job.createdBy?.name?.charAt(0) || 'E'
                                            )}
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApp.job.createdBy?.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.candidate.jobPoster}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                                            <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mr-4">
                                                <FaPhone />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t.dashboard.candidate.phone}</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedApp.job.contactPhone || t.dashboard.candidate.notProvided}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                                            <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mr-4">
                                                <FaEnvelope />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t.dashboard.candidate.email}</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedApp.job.createdBy?.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                                            <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mr-4">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t.dashboard.candidate.location}</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedApp.job.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className="w-full mt-8 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {t.dashboard.candidate.close}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CandidateDashboard;