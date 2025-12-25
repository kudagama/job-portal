const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, getMyJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/my-jobs').get(protect, getMyJobs);
router.route('/:id').get(getJobById).delete(protect, deleteJob).put(protect, updateJob);

module.exports = router;
