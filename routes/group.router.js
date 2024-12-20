const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Handle the /group endpoint
router.post('/', verifyToken, GroupController.addGroup);
router.get('/:id', verifyToken, GroupController.getGroupById);
router.post('/:id/members', verifyToken, GroupController.addMembers);

// Add more routes for the /group endpoint as needed

module.exports = router;