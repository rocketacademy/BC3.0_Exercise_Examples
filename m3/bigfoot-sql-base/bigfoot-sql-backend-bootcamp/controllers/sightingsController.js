const BaseController = require("./baseController");

class SightingsController extends BaseController {
  constructor(model) {
    super(model);
  }

  getAll = async (req, res) => {
    try {
      const sightings = await this.model.findAll({});
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
      const sighting = await this.model.findByPk(sightingId, {});
      return res.json(sighting);
    } catch (err) {
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
}

module.exports = SightingsController;
