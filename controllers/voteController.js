const Vote = require('../models/Vote');

module.exports = {
  async vote(req, res, next) {
    try {
      const { ideaId } = req.body;
      const userId = req.session.user._id;
      // cria um voto; se já existir, o índice único vai lançar erro
      await Vote.create({ idea: ideaId, user: userId });
      req.flash('success', 'Voto registrado.');
      res.redirect(`/ideas/${ideaId}`);
    } catch (err) {
      if (err.code === 11000) {
        req.flash('error', 'Você já votou nesta ideia.');
        return res.redirect('back');
      }
      next(err);
    }
  },

  async unvote(req, res, next) {
    try {
      const { ideaId } = req.body;
      await Vote.findOneAndDelete({ idea: ideaId, user: req.session.user._id });
      req.flash('success', 'Voto removido.');
      res.redirect(`/ideas/${ideaId}`);
    } catch (err) { next(err); }
  }
};
