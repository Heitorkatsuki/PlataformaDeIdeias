  const Idea = require('../models/Idea');
  const Vote = require('../models/Vote');

  module.exports = {
    async list(req, res, next) {
      try {
        const pipeline = [
          {
            $lookup: {
              from: "votes",
              localField: "_id",
              foreignField: "idea",
              as: "votes",
            },
          },
          {
            $addFields: {
              voteCount: { $size: "$votes" },
            },
          },
          {
            $project: { votes: 0 },
          },
          {
            $sort: { voteCount: -1, createdAt: -1 },
          },
        ];
        const ideas = await Idea.aggregate(pipeline);
        res.render("ideas/list", { ideas });
      } catch (err) {
        next(err);
      }
    },

    showCreate(req, res) {
      res.render("ideas/create");
    },

    async create(req, res, next) {
      try {
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
          req.flash("error", "Preencha todos os campos.");
          return res.redirect("/ideas/create");
        }
        await Idea.create({
          title,
          description,
          category,
          author: req.session.user._id,
        });
        req.flash("success", "Ideia criada.");
        res.redirect("/ideas");
      } catch (err) {
        next(err);
      }
    },

    async detail(req, res, next) {
      try {
        const id = req.params.id;
        const idea = await Idea.findById(id)
          .populate("author", "_id name email")
          .lean();

        if (!idea) {
          req.flash("error", "Ideia não encontrada");
          return res.redirect("/ideas");
        }

        const voteCount = await Vote.countDocuments({ idea: idea._id });
        const userVoted = req.session.user
          ? await Vote.exists({ idea: idea._id, user: req.session.user._id })
          : false;

        let isAuthor = false;
        if (req.session.user && idea.author) {
          isAuthor =
            idea.author._id.toString() === req.session.user._id.toString();
        }

        res.render("ideas/detail", {
          idea,
          voteCount,
          userVoted,
          currentUser: req.session.user,
          isAuthor: isAuthor,
        });
      } catch (err) {
        next(err);
      }
    },

    async showEdit(req, res) {
      const idea = await Idea.findById(req.params.id).lean();
      if (!idea) {
        req.flash("error", "Ideia não encontrada.");
        return res.redirect("/ideas");
      }
      res.render("ideas/edit", { idea });
    },

    async update(req, res, next) {
      try {
        const id = req.body.id;
        const { title, description, category } = req.body;
        await Idea.findByIdAndUpdate(id, { title, description, category });
        req.flash("success", "Ideia atualizada.");
        res.redirect(`/ideas/${id}`);
      } catch (err) {
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const idea = req.idea;
        await Vote.deleteMany({ idea: idea._id });
        await Idea.findByIdAndDelete(idea._id);
        req.flash("success", "Ideia removida com sucesso.");
        res.redirect("/ideas");
      } catch (err) {
        next(err);
      }
    },

    async myIdeas(req, res, next) {
      try {
        const ideas = await Idea.find({ author: req.session.user._id })
          .sort({ createdAt: -1 })
          .lean();
        res.render("profile", { ideas });
      } catch (err) {
        next(err);
      }
    },
  };
