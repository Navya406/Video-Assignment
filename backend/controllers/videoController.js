const Video = require('../models/Video');
const fs = require('fs');

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const video = await Video.create({
      uploader: req.user._id,
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      status: 'processing',
      sensitivity: 'unknown'
    });

    res.status(201).json({ message: 'Upload success, processing started', video });

    simulateProcessing(video, req.io);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyVideos = async (req, res) => {
    try {
      const videos = await Video.find({})
        .sort({ createdAt: -1 })
        .populate('uploader', 'username');

      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (req.user.role !== 'Admin' && video.uploader.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this video' });
    }

    if (fs.existsSync(video.path)) {
        fs.unlinkSync(video.path);
    }

    await video.deleteOne(); 

    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const simulateProcessing = (video, io) => {
    let progress = 0;
    const interval = setInterval(async () => {
        progress += 20;

        io.to(video.uploader.toString()).emit('video_progress', {
            videoId: video._id,
            progress: progress,
            status: 'processing'
        });
        
        if (progress >= 100) {
            clearInterval(interval);
            const isSafe = Math.random() > 0.3; 
            
            video.status = 'completed';
            video.sensitivity = isSafe ? 'safe' : 'flagged';
            await video.save();

            io.emit('video_progress', {
                videoId: video._id,
                progress: 100,
                status: 'completed',
                sensitivity: video.sensitivity
            });
        }
    }, 1000);
};

module.exports = { uploadVideo, getMyVideos, deleteVideo };