const express = require('express');
const router = express.Router();
const { uploadVideo, getMyVideos } = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
router.post('/upload', 
  protect, 
  authorize('Editor', 'Admin'), 
  upload.single('video'), 
  uploadVideo
);
router.get('/', protect, getMyVideos);
module.exports = router;