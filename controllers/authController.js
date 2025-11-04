const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  showRegister(req, res) { res.render('auth/register'); },

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        req.flash('error', 'Preencha todos os campos.');
        return res.redirect('/register');
      }
      const exists = await User.findOne({ email });
      if (exists) {
        req.flash('error', 'E-mail já cadastrado.');
        return res.redirect('/register');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      req.session.user = { _id: user._id, name: user.name, email: user.email };
      req.flash('success', 'Cadastro realizado com sucesso!');
      return res.redirect('/ideas');
    } catch (err) {
      next(err);
    }
  },

  showLogin(req, res) { res.render('auth/login'); },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'Credenciais inválidas.');
        return res.redirect('/login');
      }
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        req.flash('error', 'Credenciais inválidas.');
        return res.redirect('/login');
      }
      req.session.user = { _id: user._id, name: user.name, email: user.email };
      req.flash('success', 'Logado com sucesso.');
      res.redirect('/ideas');
    } catch (err) {
      next(err);
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },

  profile(req, res) {
    res.render('profile');
  },
};
