import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPencil, HiCheck, HiX, HiUser, HiMail, HiPhone, HiLocationMarker, HiBriefcase, HiInformationCircle, HiCamera } from 'react-icons/hi';

const Profile = () => {
    const { t } = useLanguage();
    const { user, token, login } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        bio: '',
        password: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
                password: ''
            });
            setImagePreview(user.profilePicture || null);
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Content-type will be set automatically by axios for FormData
                },
            };

            const dataToSend = new FormData();
            dataToSend.append('name', formData.name);
            dataToSend.append('email', formData.email);
            dataToSend.append('phone', formData.phone);
            dataToSend.append('address', formData.address);
            dataToSend.append('bio', formData.bio);
            if (formData.password) {
                dataToSend.append('password', formData.password);
            }
            if (imageFile) {
                dataToSend.append('profilePicture', imageFile);
            }

            const res = await axios.put('http://localhost:5000/api/auth/profile', dataToSend, config);
            login(res.data);
            setIsEditing(false);
            setImageFile(null); // Reset file input
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, name, type = "text", icon: Icon }) => (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{label}</label>
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 ease-in-out hover:bg-white dark:hover:bg-gray-700"
                    placeholder={`Your ${label.toLowerCase()}`}
                    disabled={name === 'email'}
                />
            </div>
        </div>
    );

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 full rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div className="ml-4 w-full">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <div className="mt-1 text-base font-semibold text-gray-900 dark:text-white break-words">
                    {value || <span className="text-gray-400 italic text-sm">{t.profile.notSet}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <main className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    {/* Cover Banner */}
                    <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative group">
                                <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full">
                                    <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md overflow-hidden relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <HiUser className="text-6xl text-slate-400 dark:text-slate-500" />
                                        )}

                                        {isEditing && (
                                            <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <HiCamera className="w-8 h-8 text-white" />
                                                <input
                                                    id="profile-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg pointer-events-none sm:hidden">
                                        <HiCamera className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-4 ml-4 hidden sm:block">
                                <h1 className="text-3xl font-bold text-white drop-shadow-md">{user?.name}</h1>
                                <p className="text-indigo-100 font-medium bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full inline-block text-sm mt-1 border border-white/20 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Name/Role (below banner) */}
                    <div className="mt-20 px-8 sm:hidden">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium capitalize">{user?.role}</p>
                    </div>

                    {/* Controls & Content */}
                    <div className="pt-20 px-8 pb-8 sm:pt-4">
                        <div className="flex justify-end mb-6">
                            {!isEditing && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 font-medium transition-all"
                                >
                                    <HiPencil className="w-5 h-5 mr-2" />
                                    {t.profile.edit}
                                </motion.button>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center text-red-600 dark:text-red-400"
                            >
                                <HiInformationCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label={t.profile.name} name="name" icon={HiUser} />
                                        <InputField label={t.profile.phone} name="phone" icon={HiPhone} />
                                        <div className="md:col-span-2">
                                            <InputField label={t.profile.email} name="email" type="email" icon={HiMail} />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.profile.address}</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                                    <HiLocationMarker className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea
                                                    name="address"
                                                    rows="2"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition"
                                                    placeholder="Your full address..."
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.profile.bio}</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                                    <HiBriefcase className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea
                                                    name="bio"
                                                    rows="4"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition"
                                                    placeholder="Tell us a bit about yourself..."
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 text-right">{t.profile.bioHint}</p>
                                        </div>

                                        <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">!</span>
                                                Change Password
                                            </h4>
                                            <InputField label={t.profile.password} name="password" type="password" icon={HiPencil} />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                                        >
                                            <HiX className="w-5 h-5 mr-1.5" />
                                            {t.profile.cancel}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 font-medium transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    {t.profile.saving}
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <HiCheck className="w-5 h-5 mr-1.5" />
                                                    {t.profile.save}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Contact Information</h3>
                                        <div className="space-y-4">
                                            <InfoItem icon={HiMail} label={t.profile.emailLabel} value={user?.email} />
                                            <InfoItem icon={HiPhone} label={t.profile.phone} value={user?.phone} />
                                            <InfoItem icon={HiLocationMarker} label={t.profile.address} value={user?.address} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">About</h3>
                                        <div className="h-full">
                                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 h-full border border-gray-100 dark:border-gray-700/50">
                                                <div className="flex items-center mb-4">
                                                    <HiBriefcase className="w-5 h-5 text-indigo-500 mr-2" />
                                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.profile.bio}</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                    {user?.bio || <span className="text-gray-400 italic">{t.profile.noBio}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;