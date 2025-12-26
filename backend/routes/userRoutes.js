const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.get('/', protect, authorize('Admin'), getAllUsers);
router.delete('/:id', protect, authorize('Admin'), deleteUser);
module.exports = router;