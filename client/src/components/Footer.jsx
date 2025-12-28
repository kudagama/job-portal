import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Description Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-white tracking-tighter mb-6 inline-block">
                            JobPortal
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Sri Lanka's #1 Service Marketplace. Connecting talented professionals with clients for seamless project execution.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 relative inline-block">
                            For Candidates
                            <span className="absolute bottom-[-8px] left-0 w-8 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/find-jobs" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/candidate/dashboard" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Career Advice
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Employers Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 relative inline-block">
                            For Employers
                            <span className="absolute bottom-[-8px] left-0 w-8 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/post-job" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Post a Job
                                </Link>
                            </li>
                            <li>
                                <Link to="/employer/dashboard" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Manage Candidates
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Pricing Plans
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-indigo-400 text-sm transition-colors flex items-center group">
                                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-1 text-indigo-500">&rsaquo;</span>
                                    Success Stories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute bottom-[-8px] left-0 w-8 h-1 bg-indigo-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <FaGlobe className="mt-1 mr-3 text-indigo-500" />
                                <span>Sriyani, Vidyachandra Mawatha,<br />Ahangama, Sri Lanka</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <a href="mailto:saveenkudagama2002@gmail.com" className="hover:text-indigo-400 transition-colors">saveenkudagama2002@gmail.com</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>+94766088374</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
