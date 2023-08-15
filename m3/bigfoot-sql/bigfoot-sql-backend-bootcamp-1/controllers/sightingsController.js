const BaseController = require("./baseController");

class SightingsController extends BaseController {
  constructor(model, commentModel, category, sighting_categories) {
    super(model);
    this.commentModel = commentModel;
    this.categoryModel = category;
    this.sighting_categories = sighting_categories;
  }

  getAll = async (req, res) => {
    try {
      const sightings = await this.model.findAll({
        include: [{ model: this.commentModel }, { model: this.categoryModel }],
      });
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
        include: this.commentModel,
      });
      return res.json(sighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  createOne = async (req, res) => {
    const sighting = req.body;

    try {
      const data = await this.model.create({
        ...sighting,
      });
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  editOne = async (req, res) => {
    const sighting = req.body;
    const sightingId = req.params.sightingId;
    try {
      const data = await this.model.update(
        {
          ...sighting,
        },
        {
          where: {
            id: sightingId,
          },
        }
      );
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  createComment = async (req, res) => {
    console.log(req.body);
    const sighting_id = req.params.sightingId;
    const comment = req.body;
    comment.sighting_id = sighting_id;
    console.log(comment);
    try {
      let data = await this.commentModel.create({
        content: comment.content,
        sighting_id: comment.sighting_id,
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
