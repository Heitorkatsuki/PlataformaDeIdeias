const Idea = require('../models/Idea');

function isLoggedIn(req, res, next) {
  if (req.session.user && req.session.user._id) return next();
  req.flash('error', 'Você precisa fazer login para acessar essa página.');
  return res.redirect('/login');
}

async function isAuthor(req, res, next) {
  try {
    const ideaId = req.params.id || req.body.id;
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      req.flash('error', 'Ideia não encontrada.');
      return res.redirect('/ideas');
    }
    if (idea.author.toString() !== req.session.user._id) {
      return res.status(403).send('Forbidden - não é o autor');
    }
    req.idea = idea;
    return next();
  } catch (err) {
    next(err);
  }
}

module.exports = { isLoggedIn, isAuthor };
