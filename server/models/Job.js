const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Construction', 'Cleaning', 'Electrical', 'Plumbing', 'Transport', 'Masonry', 'Gardening', 'Other'],
        default: 'Other',
    },
    budget: {
        type: Number,
    },
    budgetType: {
        type: String,
        enum: ['Fixed', 'Daily'],
        default: 'Fixed',
    },
    location: {
        type: String,
    },
    contactPhone: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    isUrgent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);
