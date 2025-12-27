import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // Import Language Hook
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaGoogle } from 'react-icons/fa';

const Signup = () => {
    const { t } = useLanguage(); // Get translations
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate'
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError(t.signup.passwordMismatch);
            setLoading(false);
            return;
        }

        try {
            const { name, email, password, role } = formData;
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            // Save token and user info via Context
            login(res.data);

            // Redirect based on role
            if (res.data.role === 'employer') {
                navigate('/employer/dashboard');
            } else if (res.data.role === 'candidate') {
                navigate('/candidate/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t.signup.fail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-6 sm:py-12 sm:px-6 lg:px-8 font-sans text-gray-900 dark:text-gray-200">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                        S
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Saviya.lk</h1>
                </div>
                <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {t.signup.title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t.signup.subtitle}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 py-6 px-4 sm:py-8 sm:px-10 shadow-xl sm:rounded-xl border border-gray-100 dark:border-gray-700">

                    {error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-300 animate-pulse text-sm">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.signup.iWantTo}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                    className={`relative py-3 px-4 border rounded-lg text-sm font-bold text-center focus:outline-none transition-all ${formData.role === 'candidate'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 shadow-sm'
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {t.signup.getHired}
                                    {formData.role === 'candidate' && <FaCheckCircle className="absolute top-2 right-2 text-indigo-500" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'employer' })}
                                    className={`relative py-3 px-4 border rounded-lg text-sm font-bold text-center focus:outline-none transition-all ${formData.role === 'employer'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 shadow-sm'
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {t.signup.hireTalent}
                                    {formData.role === 'employer' && <FaCheckCircle className="absolute top-2 right-2 text-indigo-500" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.signup.name}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400 dark:text-gray-500 sm:text-sm" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder={t.signup.placeholderName}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.signup.email}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400 dark:text-gray-500 sm:text-sm" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.signup.password}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 dark:text-gray-500 sm:text-sm" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.signup.confirmPassword}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 dark:text-gray-500 sm:text-sm" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-95 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t.signup.creating : t.signup.createAccount}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t.signup.orContinue}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href="#"
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                                {t.signup.google}
                            </a>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t.signup.haveAccount}{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                        {t.signup.signIn}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;