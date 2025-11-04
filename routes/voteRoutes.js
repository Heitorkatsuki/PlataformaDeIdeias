const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { isLoggedIn } = require('../middlewares/auth');

router.post('/vote', isLoggedIn, voteController.vote);
router.post('/unvote', isLoggedIn, voteController.unvote);

module.exports = router;
