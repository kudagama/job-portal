const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        if (!jobId || !coverLetter) {
            return res.status(400).json({ message: 'Please provide job ID and cover letter' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            coverLetter
        });

        res.status(201).json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged in user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate({
                path: 'job',
                select: 'title company location budget status contactPhone', // Ensure contactPhone is selected
                populate: { path: 'createdBy', select: 'name email profilePicture' }
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private
const getJobApplications = async (req, res) => {
    try {
        console.log("-----------------------------------------");
        console.log("Request received for Job ID:", req.params.jobId);
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email phone profilePicture') // Get applicant details
            .sort({ createdAt: -1 });
        console.log("Number of applications found:", applications.length);
        if (applications.length > 0) {
            console.log("First application sample:", applications[0]);
        } else {
            console.log("No applications found in DB for this Job ID.");
        }
        res.status(200).json(applications);
    } catch (error) { console.error("Error fetching applications:", error); res.status(500).json({ message: error.message }); }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!['Accepted', 'Rejected', 'Finished'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(applicationId).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure the logged-in user is the employer of the job
        const job = application.job;
        if (job.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        if (status === 'Accepted' || status === 'Finished') {
            await Job.findByIdAndUpdate(job._id, { status: 'Closed' });
        }

        application.status = status;
        await application.save();

        res.json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
};
