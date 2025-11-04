const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// índice único composto para garantir voto único por usuário/idea
VoteSchema.index({ idea: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
