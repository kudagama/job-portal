import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaArrowLeft, FaBriefcase } from 'react-icons/fa';

const ApplyJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
                setJob(res.data);
            } catch (err) {
                console.error("Error fetching job:", err);
                setError("Could not load job details.");
            }
        };
        fetchJob();
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('http://localhost:5000/api/applications', {
                jobId,
                coverLetter
            }, config);

            setSuccess(true);
            setTimeout(() => {
                navigate('/candidate/dashboard');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit application.');
            setLoading(false);
        }
    };

    if (!job && !error) return <div className="text-center py-20">Loading job details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mb-6">
                    <FaArrowLeft className="mr-2" /> Back
                </button>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Apply for {job?.title}
                </h2>
                <div className="mt-2 text-center text-sm text-gray-500 flex justify-center items-center">
                    <FaBriefcase className="mr-1" /> {job?.company || 'Freelance Project'}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <FaPaperPlane className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Application Sent!</h3>
                            <p className="mt-1 text-sm text-gray-500">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                                    <p>{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                                    Cover Letter / Proposal
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="coverLetter"
                                        rows={6}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Explain why you are the best fit for this role..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CV / Resume (Optional)
                                </label>
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ApplyJob;
