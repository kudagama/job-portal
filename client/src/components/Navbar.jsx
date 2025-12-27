import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUserCircle, HiLogout, HiGlobeAlt } from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, language, switchLanguage } = useLanguage();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const toggleLanguage = () => {
        switchLanguage(language === 'en' ? 'si' : 'en');
    };

    return (
        <nav className="sticky top-0 z-50 glass transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 transform hover:scale-105 transition-transform duration-200">
                            <div className="bg-indigo-600 text-white h-10 w-10 flex items-center justify-center rounded-lg shadow-sm">
                                <span className="font-bold text-2xl">S</span>
                            </div>
                            <span className="text-2xl font-extrabold text-indigo-700 tracking-tight leading-none">
                                Saviya<span className="text-gray-500 text-xl">.lk</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {/* Show Home link if NOT logged in OR if user is a Candidate */}
                        {(!user || user.role === 'candidate') && (
                            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                                {t.navbar.home}
                            </Link>
                        )}

                        {/* Guest or Candidate sees Find Jobs */}
                        {(!user || user.role === 'candidate') && (
                            <Link to="/find-jobs" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                                {t.navbar.findJobs}
                            </Link>
                        )}

                        {/* Employer Links */}
                        {user && user.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                                    {t.navbar.dashboard}
                                </Link>
                                <Link to="/post-job" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                                    {t.navbar.postJob}
                                </Link>
                            </>
                        )}

                        {/* Candidate Links */}
                        {user && user.role === 'candidate' && (
                            <Link to="/candidate/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                                {t.navbar.dashboard}
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg transition-colors"
                            title="Switch Language"
                        >
                            <HiGlobeAlt className="w-5 h-5" />
                            <span className="uppercase">{language}</span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <HiUserCircle className="w-5 h-5 mr-2 text-indigo-500" />
                                    <span>{user.name}</span>
                                </div>
                                <Link to="/profile" className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all" title={t.navbar.profile}>
                                    {t.navbar.profile}
                                </Link>
                                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all" title={t.navbar.logout}>
                                    <HiLogout className="w-5 h-5 mr-1" />
                                    {t.navbar.logout}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 transition-colors">
                                    {t.navbar.login}
                                </Link>
                                <Link to="/signup" className="px-5 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                    {t.navbar.signup}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-medium"
                        >
                            <span className="uppercase">{language}</span>
                        </button>

                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors"
                        >
                            {isOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {(!user || user.role === 'candidate') && (
                                <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    {t.navbar.home}
                                </Link>
                            )}

                            {(!user || user.role === 'candidate') && (
                                <Link to="/find-jobs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    {t.navbar.findJobs}
                                </Link>
                            )}

                            {user && user.role === 'employer' && (
                                <>
                                    <Link to="/employer/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                        {t.navbar.dashboard}
                                    </Link>
                                    <Link to="/post-job" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                        {t.navbar.postJob}
                                    </Link>
                                </>
                            )}

                            {user && user.role === 'candidate' && (
                                <Link to="/candidate/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    {t.navbar.dashboard}
                                </Link>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                {user ? (
                                    <>
                                        <div className="flex items-center px-3 py-2 mb-2 text-indigo-700 bg-indigo-50 rounded-lg">
                                            <HiUserCircle className="w-6 h-6 mr-2" />
                                            <span className="font-medium">{user.name} ({user.role})</span>
                                        </div>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                            {t.navbar.profile}
                                        </Link>
                                        <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors">
                                            <HiLogout className="w-5 h-5 mr-2" />
                                            {t.navbar.logout}
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3 pt-2">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                                            {t.navbar.login}
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                                            {t.navbar.signup}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
