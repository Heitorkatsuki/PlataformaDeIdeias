const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');

// list public
router.get('/', ideaController.list);

// create
router.get('/create', isLoggedIn, ideaController.showCreate);
router.post('/create', isLoggedIn, ideaController.create);

// detail
router.get('/:id', ideaController.detail);

// edit (only author)
router.get('/edit/:id', isLoggedIn, isAuthor, ideaController.showEdit);
router.post('/edit', isLoggedIn, isAuthor, ideaController.update);

// delete
router.post('/delete', isLoggedIn, isAuthor, ideaController.remove);

// profile (ideas by user)
router.get('/my/ideas', isLoggedIn, ideaController.myIdeas);

module.exports = router;
