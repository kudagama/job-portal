import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaMoneyBillWave, FaClock, FaBriefcase, FaBolt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // Import Language Hook

const FindJobs = () => {
    const { t } = useLanguage(); // Get translations
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
            [field]: prev[field] === value ? '' : value
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
        <div className="min-h-screen py-8 font-sans text-gray-800 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center sm:text-left"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <FaBriefcase className="text-indigo-600" />
                        </div>
                        {t.findJobs.title}
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">{t.findJobs.subTitle}</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full lg:w-1/4 space-y-6"
                    >

                        <div className="glass p-6 rounded-2xl sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-200/50">
                                <FaFilter className="text-indigo-500" /> {t.findJobs.filters}
                            </h3>

                            {/* Urgency Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider opacity-70">{t.findJobs.urgency}</h4>
                                <label className="flex items-center space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-white/50 transition-all border border-transparent hover:border-red-100">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.isUrgent ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'}`}>
                                        {filters.isUrgent && <FaBolt className="text-white text-xs" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={filters.isUrgent}
                                        onChange={handleUrgentChange}
                                        className="hidden"
                                    />
                                    <span className="text-gray-700 font-medium group-hover:text-red-700 transition-colors text-sm">
                                        {t.findJobs.urgentOnly}
                                    </span>
                                </label>
                            </div>

                            {/* Budget Type Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider opacity-70">{t.findJobs.paymentType}</h4>
                                <div className="space-y-2">
                                    {['Fixed', 'Daily'].map((type) => (
                                        <label key={type} className={`flex items-center space-x-3 cursor-pointer group p-3 rounded-xl transition-all border ${filters.budgetType === type ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white/50'}`}>
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                checked={filters.budgetType === type}
                                                onChange={() => handleFilterChange('budgetType', type)}
                                                className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 bg-transparent"
                                            />
                                            <span className={`text-sm ${filters.budgetType === type ? 'text-indigo-700 font-bold' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                                                {type === 'Fixed' ? t.findJobs.fixed : t.findJobs.daily}
                                            </span>
                                        </label>
                                    ))}
                                    <label className={`flex items-center space-x-3 cursor-pointer group p-3 rounded-xl transition-all border ${filters.budgetType === '' ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white/50'}`}>
                                        <input
                                            type="radio"
                                            name="budgetType"
                                            checked={filters.budgetType === ''}
                                            onChange={() => setFilters(prev => ({ ...prev, budgetType: '' }))}
                                            className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 bg-transparent"
                                        />
                                        <span className={`text-sm ${filters.budgetType === '' ? 'text-indigo-700 font-bold' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                                            {t.findJobs.allTypes}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider opacity-70">{t.findJobs.location}</h4>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={t.findJobs.enterCity}
                                        value={filters.location}
                                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
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
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={t.findJobs.search}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-14 pr-4 py-5 glass border-0 rounded-2xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all text-lg shadow-sm hover:shadow-md"
                            />
                        </motion.div>

                        {loading ? (
                            <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/20">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                                <div className="text-indigo-800 font-semibold text-lg">{t.findJobs.loading}</div>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                {jobs.length === 0 ? (
                                    <div className="text-center py-20 glass rounded-3xl">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-4xl">
                                            <FaSearch />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t.findJobs.noJobs}</h3>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto">{t.findJobs.noJobsSub}</p>
                                        <button
                                            onClick={() => { setKeyword(''); setFilters({ budgetType: '', isUrgent: false, location: '' }) }}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                        >
                                            {t.findJobs.clearFilters}
                                        </button>
                                    </div>
                                ) : (
                                    jobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02, translateY: -5 }}
                                            className="glass p-6 md:p-8 rounded-2xl hover:border-indigo-200 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                                        >
                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="relative flex flex-col sm:flex-row gap-6">
                                                {/* Icon */}
                                                <div className="flex-shrink-0">
                                                    <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg transform group-hover:rotate-3 transition-transform duration-300">
                                                        {job.category ? job.category.charAt(0) : 'T'}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow">
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                                                        <div>
                                                            <button
                                                                onClick={() => handleViewDetails(job._id)}
                                                                className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 text-left"
                                                            >
                                                                {job.title}
                                                            </button>
                                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                                <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                                                    {job.category}
                                                                </span>
                                                                <span className="flex items-center"><FaClock className="mr-1" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {job.isUrgent && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                                                                    <FaBolt className="mr-1" /> {t.jobDetails?.urgent || 'Urgent'}
                                                                </span>
                                                            )}
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${job.budgetType === 'Fixed' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                                                {job.budgetType === 'Fixed' ? t.findJobs.fixed : t.findJobs.daily}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-base line-clamp-2 mb-6 leading-relaxed">
                                                        {job.description}
                                                    </p>

                                                    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-gray-100/50 gap-4">
                                                        <div className="flex flex-wrap gap-6 text-sm">
                                                            <div className="flex items-center text-gray-600 font-medium">
                                                                <FaMapMarkerAlt className="mr-2 text-indigo-400 text-lg" />
                                                                {job.location || 'Remote'}
                                                            </div>
                                                            <div className="flex items-center text-gray-900 font-bold">
                                                                <FaMoneyBillWave className="mr-2 text-green-500 text-lg" />
                                                                Rs. {job.budget}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleViewDetails(job._id)}
                                                            className="w-full sm:w-auto text-center bg-gray-900 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95 text-sm"
                                                        >
                                                            {t.findJobs.viewDetails}
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