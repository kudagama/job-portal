import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FaTools, FaBolt, FaBroom, FaPaintRoller, FaTruck, FaHammer, FaTree, FaCheckCircle, FaUserShield, FaClock, FaCreditCard } from 'react-icons/fa';

const Home = () => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setFeaturedJobs(res.data.slice(0, 6)); // Get latest 6 jobs
                setLoading(false);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const jobCategories = [
        { name: 'Home Repairs', jobs: '20+ Tasks', icon: <FaTools /> },
        { name: 'Cleaning', jobs: '15+ Tasks', icon: <FaBroom /> },
        { name: 'Electrical', jobs: '10+ Tasks', icon: <FaBolt /> },
        { name: 'Plumbing', jobs: '8+ Tasks', icon: <FaTools /> }, // Using tools as generic for plumbing if specific not available
        { name: 'Moving', jobs: '12+ Tasks', icon: <FaTruck /> },
        { name: 'Painting', jobs: '5+ Tasks', icon: <FaPaintRoller /> },
        { name: 'Construction', jobs: '18+ Tasks', icon: <FaHammer /> },
        { name: 'Gardening', jobs: '7+ Tasks', icon: <FaTree /> },
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="w-full font-sans text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-semibold mb-6 backdrop-blur-sm"
                    >
                        #1 Service Marketplace in Sri Lanka
                    </motion.span>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
                    >
                        {t.home.heroTitle}
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        {t.home.heroSub}
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                    >
                        <Link to="/find-jobs" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 text-lg">
                            {t.home.findJobsBtn}
                        </Link>
                        <Link to="/post-job" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all transform hover:-translate-y-1 text-lg">
                            {t.home.postJobBtn}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-20 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t.home.whyChooseUs}</h2>
                        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    >
                        {[
                            { icon: <FaUserShield className="w-10 h-10" />, title: t.home.trustedPros, desc: 'Every worker is verified to ensure high-quality service and safety for your home.' },
                            { icon: <FaClock className="w-10 h-10" />, title: t.home.fastReliable, desc: 'Get quick responses and timely service execution from our dedicated network.' },
                            { icon: <FaCreditCard className="w-10 h-10" />, title: t.home.securePayments, desc: 'Transparent pricing and secure payment options for complete peace of mind.' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-center group"
                            >
                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 md:py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t.home.howItWorks}</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Getting things done has never been easier.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-12">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.home.postJobStep}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Describe what you need done, from home repairs to cleaning. It's free and easy.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.home.chooseExpertStep}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Review profiles, ratings, and quotes to pick the best professional for your task.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.home.getItDoneStep}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Your pro arrives and gets the job done. Pay securely only when you're satisfied.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                            {/* Placeholder illustrating the concept if no image available */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-90"></div>
                            <div className="relative z-10 text-white text-center p-8">
                                <FaCheckCircle className="w-24 h-24 mx-auto mb-6 opacity-80" />
                                <h3 className="text-3xl font-bold">Simple & Secure</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 md:py-20 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.home.exploreCategories}</h2>
                            <p className="text-slate-600 dark:text-slate-400">Find professionals for every need</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {jobCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 cursor-pointer group hover:border-indigo-200 dark:hover:border-indigo-500 transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{category.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{category.jobs}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Footer */}
            <section className="py-16 md:py-20 bg-indigo-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 rounded-full blur-[120px] opacity-30" />
                    <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[120px] opacity-30" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.home.readyToStart}</h2>
                    <p className="text-xl text-indigo-200 mb-10">Join thousands of satisfied customers and skilled professionals today.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all text-lg shadow-lg">
                            {t.home.registerNow}
                        </Link>
                        <Link to="/find-jobs" className="px-8 py-4 bg-indigo-800 border border-indigo-700 text-white font-bold rounded-full hover:bg-indigo-700 transition-all text-lg">
                            {t.home.browseJobs}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
