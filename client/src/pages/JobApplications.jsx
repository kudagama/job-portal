import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCheck, FaTimes, FaArrowLeft, FaFileAlt, FaLock, FaStar, FaCheckDouble } from 'react-icons/fa';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Review Modal State (Writing a review)
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // View Reviews Modal State (Viewing reviews)
    const [viewReviewsOpen, setViewReviewsOpen] = useState(false);
    const [applicantReviews, setApplicantReviews] = useState([]);
    const [viewingApplicantName, setViewingApplicantName] = useState('');
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Fetch applications and Job Details
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [appRes, jobRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/applications/job/${jobId}`, config),
                    axios.get(`http://localhost:5000/api/jobs/${jobId}`, config)
                ]);

                setApplications(appRes.data);
                setJob(jobRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load applications.");
                setLoading(false);
            }
        };

        if (token && jobId) {
            fetchData();
        }
    }, [jobId, token]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus }, config);

            const updatedApps = applications.map(app =>
                app._id === id ? { ...app, status: newStatus } : app
            );
            setApplications(updatedApps);

            if (newStatus === 'Accepted') {
                setJob(prev => ({ ...prev, status: 'Closed' }));
            }

        } catch (err) {
            console.error("Error updating status", err);
            alert("Failed to update status");
        }
    };

    const openReviewModal = (applicantId) => {
        setReviewTarget(applicantId);
        setRating(5);
        setComment('');
        setIsReviewOpen(true);
    };

    const openViewReviewsModal = async (applicantId, applicantName) => {
        setViewingApplicantName(applicantName);
        setViewReviewsOpen(true);
        setReviewsLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/user/${applicantId}`);
            setApplicantReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setApplicantReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewTarget) return;

        setReviewSubmitting(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('http://localhost:5000/api/reviews', {
                revieweeId: reviewTarget,
                jobId: jobId,
                rating,
                comment
            }, config);

            alert("Review submitted successfully!");
            setIsReviewOpen(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans relative transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/employer/dashboard')} className="mb-6 flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Job Applications <span className="text-gray-400 dark:text-gray-500 text-lg ml-2">({applications.length})</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                            For: <span className="font-semibold text-gray-700 dark:text-gray-200 ml-1">{job?.title}</span>
                            {job?.status === 'Closed' && (
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                    <FaLock className="mr-1" /> Position Closed
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-16 text-center border border-gray-200 dark:border-gray-700">
                        <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500 text-2xl">
                            <FaUser />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Wait for candidates to apply for this position.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="md:flex">
                                    {/* Candidate Info Column */}
                                    <div className="p-8 md:w-1/3 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center mb-6">
                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md mr-4 overflow-hidden">
                                                {app.applicant?.profilePicture ? (
                                                    <img src={app.applicant.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    app.applicant?.name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                                    {app.applicant?.name || 'Unknown Candidate'}
                                                </h3>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${app.status === 'Accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' :
                                                        app.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' :
                                                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                    <button
                                                        onClick={() => openViewReviewsModal(app.applicant?._id, app.applicant?.name)}
                                                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800 transition-colors ml-2"
                                                    >
                                                        <FaStar className="mr-1 text-yellow-400 text-[10px]" /> See Reviews
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center mr-3 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors">
                                                    <FaEnvelope className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                                                </div>
                                                <a href={`mailto:${app.applicant?.email}`} className="truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                    {app.applicant?.email || 'N/A'}
                                                </a>
                                            </div>
                                            <div className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center mr-3 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors">
                                                    <FaPhone className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                                                </div>
                                                <span>{app.applicant?.phone || 'No phone provided'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Application Content Column */}
                                    <div className="p-8 md:w-2/3 flex flex-col">
                                        <div className="flex-grow">
                                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                                                <FaFileAlt className="mr-2" /> Cover Letter
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                                {app.coverLetter}
                                            </div>
                                        </div>

                                        {/* Actions Footer */}
                                        {app.status === 'Pending' ? (
                                            job?.status === 'Closed' ? (
                                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                                    <FaLock className="mr-2" /> This job is closed. No further actions can be taken.
                                                </div>
                                            ) : (
                                                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
                                                    >
                                                        <FaCheck className="mr-2" /> Accept Application
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                        className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
                                                    >
                                                        <FaTimes className="mr-2" /> Reject
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center text-sm gap-4">
                                                <div className="text-gray-500 dark:text-gray-400 italic">
                                                    {app.status === 'Accepted' && (
                                                        <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                                                            <FaCheck className="mr-1" /> Accepted on {new Date(app.updatedAt || Date.now()).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {app.status === 'Finished' && (
                                                        <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                                            <FaCheckDouble className="mr-1" /> Job Completed
                                                        </span>
                                                    )}
                                                    {app.status === 'Rejected' && (
                                                        <span className="flex items-center text-red-500 dark:text-red-400 font-medium">
                                                            <FaTimes className="mr-1" /> Rejected
                                                        </span>
                                                    )}
                                                </div>

                                                {app.status === 'Accepted' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'Finished')}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                                    >
                                                        <FaCheckDouble className="mr-2" />
                                                        Mark Job Done
                                                    </button>
                                                )}

                                                {app.status === 'Finished' && (
                                                    <button
                                                        onClick={() => openReviewModal(app.applicant._id)}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg font-medium transition-colors"
                                                    >
                                                        <FaStar className="mr-2 text-indigo-500 dark:text-indigo-400" />
                                                        Write a Review
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {isReviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                        >
                            <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4 flex justify-between items-center text-white">
                                <h3 className="text-xl font-bold flex items-center">
                                    <FaStar className="mr-2 text-yellow-300" /> Write a Review
                                </h3>
                                <button onClick={() => setIsReviewOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={submitReview} className="p-6">
                                <div className="mb-6 text-center">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Rate their work</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Detailed Feedback</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Describe your experience working with this candidate..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsReviewOpen(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={reviewSubmitting}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {reviewSubmitting ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* View Reviews Modal */}
            <AnimatePresence>
                {viewReviewsOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[80vh] flex flex-col"
                        >
                            <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4 flex justify-between items-center text-white shrink-0">
                                <h3 className="text-xl font-bold flex items-center">
                                    <FaStar className="mr-2 text-yellow-300" /> Reviews for {viewingApplicantName}
                                </h3>
                                <button onClick={() => setViewReviewsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {reviewsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                                    </div>
                                ) : applicantReviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <FaStar className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
                                        <p>No reviews found for this candidate.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applicantReviews.map(review => (
                                            <div key={review._id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                                                        {review.reviewer?.name || 'Employer'}
                                                    </div>
                                                    <div className="flex text-yellow-400 text-xs gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-2 font-medium">
                                                    Project: {review.job?.title}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobApplications;
