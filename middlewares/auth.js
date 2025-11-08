const Idea = require("../models/Idea");

function isLoggedIn(req, res, next) {
  if (req.session.user && req.session.user._id) return next();
  req.flash("error", "Você precisa fazer login para acessar essa página.");
  return res.redirect("/login");
}

async function isAuthor(req, res, next) {
  try {
    const ideaId = req.params.id || req.body.id;

    if (!ideaId) {
      req.flash("error", "ID da ideia não informado.");
      return res.redirect("/ideas");
    }

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      req.flash("error", "Ideia não encontrada.");
      return res.redirect("/ideas");
    }

    const authorId = idea.author.toString();
    const userId = req.session.user._id.toString();

    if (authorId !== userId) {
      req.flash("error", "Você não tem permissão para realizar esta ação.");
      return res.redirect("/ideas");
    }

    req.idea = idea;
    return next();
  } catch (err) {
    next(err);
  }
}


module.exports = { isLoggedIn, isAuthor };