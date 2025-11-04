function globalErrorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Formulário inválido (CSRF). Tente novamente.');
    return res.redirect('back');
  }
  res.status(500);
  if (req.accepts('html')) {
    return res.render('500', { error: err.message || 'Erro interno' });
  }
  return res.json({ error: err.message || 'Erro interno' });
}

module.exports = globalErrorHandler;
