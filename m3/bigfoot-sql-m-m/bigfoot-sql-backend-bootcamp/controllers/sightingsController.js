const BaseController = require("./baseController");

class SightingsController extends BaseController {
  constructor(model, comment, like, category) {
    super(model);
    this.commentModel = comment;
    this.likeModel = like;
    this.category = category;
  }

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

  // Retrieve specific sighting and comments
  getOne = async (req, res) => {
    const { sightingId } = req.params;
    try {
      const sighting = await this.model.findByPk(sightingId, {
        include: [this.commentModel, this.category, this.likeModel],
      });
      console.log("sighting", sighting);
      return res.json(sighting);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  createOne = async (req, res) => {
    const sighting = req.body;
    console.log(sighting);

    try {
      const data = await this.model.create({
        ...sighting,
      });

      console.log("response from db", data);
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

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

  getLikes = async (req, res) => {
    const sightingId = req.params.sightingId;
    try {
      const data = await this.likeModel.findAll({
        where: { sightingId: sightingId },
      });

      console.log(data);

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

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

  createComment = async (req, res) => {
    console.log(req.body);
    const comment = req.body;
    console.log(comment);
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

  editComment = async (req, res) => {
    console.log("editing", req.body);
    const comment = req.body;
    console.log("comment", comment);
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
