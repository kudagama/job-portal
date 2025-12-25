const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');

router.post('/', protect, applyForJob);
router.get('/my-applications', protect, getMyApplications);
router.get('/job/:jobId', protect, getJobApplications);
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;
