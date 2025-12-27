import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUserCircle, HiLogout, HiGlobeAlt, HiMoon, HiSun, HiChevronDown } from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, language, switchLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
        setDropdownOpen(false);
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
                            <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight leading-none">
                                Saviya<span className="text-gray-500 dark:text-gray-400 text-xl">.lk</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {/* Show Home link if NOT logged in OR if user is a Candidate */}
                        {(!user || user.role === 'candidate') && (
                            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                                {t.navbar.home}
                            </Link>
                        )}

                        {/* Guest or Candidate sees Find Jobs */}
                        {(!user || user.role === 'candidate') && (
                            <Link to="/find-jobs" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                                {t.navbar.findJobs}
                            </Link>
                        )}

                        {/* Employer Links */}
                        {user && user.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                                    {t.navbar.dashboard}
                                </Link>
                                <Link to="/post-job" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                                    {t.navbar.postJob}
                                </Link>
                            </>
                        )}

                        {/* Candidate Links */}
                        {user && user.role === 'candidate' && (
                            <Link to="/candidate/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                                {t.navbar.dashboard}
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    <HiUserCircle className="w-6 h-6 text-indigo-500" />
                                    <span className="max-w-[150px] truncate">{user.name}</span>
                                    <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden z-50"
                                        >
                                            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.email || user.username}</p>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 capitalize">{user.role}</p>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors mr-3">
                                                        <HiUserCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    {t.navbar.profile}
                                                </Link>

                                                <button
                                                    onClick={() => { toggleTheme(); }}
                                                    className="flex w-full items-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div className="p-2 bg-amber-50 dark:bg-gray-700 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-gray-600 transition-colors mr-3">
                                                        {theme === 'dark' ? <HiSun className="w-5 h-5 text-amber-500" /> : <HiMoon className="w-5 h-5 text-gray-500" />}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => { toggleLanguage(); }}
                                                    className="flex w-full items-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors mr-3">
                                                        <HiGlobeAlt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1 text-left flex justify-between items-center">
                                                        <span>Language</span>
                                                        <span className="uppercase text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{language}</span>
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="py-2 border-t border-gray-100 dark:border-gray-700 mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                                                >
                                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors mr-3">
                                                        <HiLogout className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    {t.navbar.logout}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                {/* Theme Switcher for Guests */}
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                >
                                    {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                                </button>

                                {/* Language Switcher for Guests */}
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-3 py-2 rounded-lg transition-colors"
                                    title="Switch Language"
                                >
                                    <HiGlobeAlt className="w-5 h-5" />
                                    <span className="uppercase">{language}</span>
                                </button>

                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium px-4 py-2 transition-colors">
                                        {t.navbar.login}
                                    </Link>
                                    <Link to="/signup" className="px-5 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                        {t.navbar.signup}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                        >
                            {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 font-medium"
                        >
                            <span className="uppercase">{language}</span>
                        </button>

                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors"
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
                        className="md:hidden overflow-hidden glass border-b border-gray-100 dark:border-gray-700"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {(!user || user.role === 'candidate') && (
                                <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                    {t.navbar.home}
                                </Link>
                            )}

                            {(!user || user.role === 'candidate') && (
                                <Link to="/find-jobs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                    {t.navbar.findJobs}
                                </Link>
                            )}

                            {user && user.role === 'employer' && (
                                <>
                                    <Link to="/employer/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                        {t.navbar.dashboard}
                                    </Link>
                                    <Link to="/post-job" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                        {t.navbar.postJob}
                                    </Link>
                                </>
                            )}

                            {user && user.role === 'candidate' && (
                                <Link to="/candidate/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                    {t.navbar.dashboard}
                                </Link>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                {user ? (
                                    <>
                                        <div className="flex items-center px-3 py-2 mb-2 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800 rounded-lg">
                                            <HiUserCircle className="w-6 h-6 mr-2" />
                                            <span className="font-medium">{user.name} ({user.role})</span>
                                        </div>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                                            {t.navbar.profile}
                                        </Link>
                                        <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <HiLogout className="w-5 h-5 mr-2" />
                                            {t.navbar.logout}
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3 pt-2">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
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
