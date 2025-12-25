import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tighter hover:text-indigo-700 transition-colors">
                            JobPortal
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Home
                        </Link>

                        {/* Guest or Candidate sees Find Jobs */}
                        {(!user || user.role === 'candidate') && (
                            <Link to="/find-jobs" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                Find Jobs
                            </Link>
                        )}

                        {/* Employer Links */}
                        {user && user.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/post-job" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Post a Job
                                </Link>
                            </>
                        )}

                        {/* Candidate Links */}
                        {user && user.role === 'candidate' && (
                            <Link to="/candidate/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-medium">Hello, {user.name}</span>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium px-4 py-2 transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="text-gray-500 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition-colors"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100 shadow-lg">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                        Home
                    </Link>

                    {(!user || user.role === 'candidate') && (
                        <Link to="/find-jobs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                            Find Jobs
                        </Link>
                    )}

                    {user && user.role === 'employer' && (
                        <>
                            <Link to="/employer/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/post-job" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                                Post a Job
                            </Link>
                        </>
                    )}

                    {user && user.role === 'candidate' && (
                        <Link to="/candidate/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                            Dashboard
                        </Link>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-50 mb-2">
                                    Signed in as {user.name} ({user.role})
                                </div>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 rounded-md transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 rounded-md transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full mt-2 px-3 py-3 text-center text-base font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
