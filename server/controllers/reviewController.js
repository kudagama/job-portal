const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Employer only mainly, but logic can be general)
const createReview = async (req, res) => {
    try {
        const { revieweeId, jobId, rating, comment } = req.body;

        // Check if reviewee exists
        const reviewee = await User.findById(revieweeId);
        if (!reviewee) {
            return res.status(404).json({ message: 'User to review not found' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: req.user._id,
            job: jobId,
            reviewee: revieweeId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this user for this job' });
        }

        const review = await Review.create({
            reviewer: req.user._id,
            reviewee: revieweeId,
            job: jobId,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsForUser = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name profilePicture')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createReview,
    getReviewsForUser
};
