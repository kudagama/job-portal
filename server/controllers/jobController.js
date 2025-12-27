const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { keyword, category, budgetType, isUrgent, location } = req.query;

        let query = {
            status: 'Open'
        };

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (budgetType) {
            query.budgetType = budgetType;
        }

        if (isUrgent === 'true') {
            query.isUrgent = true;
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Public (for now)
const createJob = async (req, res) => {
    const { title, description, category, budget, budgetType, location, contactPhone, isUrgent } = req.body;

    try {
        const job = new Job({
            title,
            description,
            category,
            budget,
            budgetType,
            location,
            contactPhone,
            isUrgent,
            createdBy: req.user.id,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user jobs
// @route   GET /api/jobs/my-jobs
// @access  Private
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });

        // Fetch applications for these jobs to determine detailed status
        // We only care about Accepted or Finished ones to distinguish "In Progress" vs "Finished" for Closed jobs
        const jobIds = jobs.map(job => job._id);
        const applications = await require('../models/Application').find({
            job: { $in: jobIds },
            status: { $in: ['Accepted', 'Finished'] }
        });

        const jobsWithStatus = jobs.map(job => {
            const jobObj = job.toObject();
            const acceptedApp = applications.find(app => app.job.toString() === job._id.toString());

            if (acceptedApp) {
                // If there is an Accepted or Finished application, treat the job as Closed for the dashboard
                jobObj.status = 'Closed';

                if (acceptedApp.status === 'Finished') {
                    jobObj.detailedStatus = 'Finished';
                } else {
                    jobObj.detailedStatus = 'In Progress';
                }
            } else {
                // Fallback to the actual job status if no application is active
                if (job.status === 'Closed') {
                    jobObj.detailedStatus = 'Closed'; // Manually closed
                } else {
                    jobObj.detailedStatus = 'Open';
                }
            }
            return jobObj;
        });

        res.status(200).json(jobsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the job user
        if (job.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the job user
        if (job.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    getJobById,
    createJob,
    getMyJobs,
    updateJob,
    deleteJob,
};
