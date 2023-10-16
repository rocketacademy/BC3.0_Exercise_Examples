const BaseController = require("./baseController");

// Sightings controller has extended the base controller and will therefore have a given getAll method.
class SightingsController extends BaseController {
  // inject the comment, category and like models into this controller for eager loading
  constructor(model, comment, like, category) {
    super(model);
    this.commentModel = comment;
    this.likeModel = like;
    this.category = category;
  }

  // get all to include comment and category model
  getAll = async (req, res) => {
    try {
      const sightings = await this.model.findAll({
        include: [this.commentModel, this.category],
      });
      console.log(sightings);
      res.json(sightings);
    } catch (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true, msg: err });
      }
    }
  };

  // Retrieve specific sighting with comments, likes and categories
  getOne = async (req, res) => {
    const { sightingId } = req.params;
    try {
      const sighting = await this.model.findByPk(sightingId, {
        include: [this.commentModel, this.category, this.likeModel],
      });
      return res.json(sighting);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Create a sighting in the DB
  createOne = async (req, res) => {
    const sighting = req.body;
    try {
      const data = await this.model.create({
        ...sighting,
      });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Like a sightinging by id.
  likeOne = async (req, res) => {
    const sightingId = req.params.sightingId;
    try {
      await this.likeModel.create({
        sightingId: sightingId,
      });

      return res.json("Success");
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Get likes for a particular sighting
  getLikes = async (req, res) => {
    const sightingId = req.params.sightingId;
    try {
      const data = await this.likeModel.findAll({
        where: { sightingId: sightingId },
      });
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Edit a sighting
  editOne = async (req, res) => {
    const sighting = req.body;
    const sightingId = req.params.sightingId;
    try {
      await this.model.update(
        {
          ...sighting,
        },
        {
          where: {
            id: sightingId,
          },
        }
      );
      return res.json(sightingId);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Add a comment to a sighting
  createComment = async (req, res) => {
    const comment = req.body;
    try {
      let data = await this.commentModel.create({
        content: comment.content,
        sightingId: req.params.sightingId,
      });
      return res.json(data);
    } catch (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true, msg: err });
      }
    }
  };

  // Edit a comment assosiated to a sighting
  editComment = async (req, res) => {
    const comment = req.body;
    try {
      let data = await this.commentModel.update(
        {
          content: comment.content,
          updatedAt: comment.updatedAt,
        },
        {
          where: {
            id: req.params.commentId,
          },
        }
      );
      return res.json(data);
    } catch (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true, msg: err });
      }
    }
  };

  // Delete a comment within the database.
  deleteComment = async (req, res) => {
    try {
      let data = await this.commentModel.destroy({
        where: {
          id: req.params.commentId,
        },
      });
      return res.json(data);
    } catch (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true, msg: err });
      }
    }
  };
}

module.exports = SightingsController;
