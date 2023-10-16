const BaseController = require("./baseController");

// Sightings contorller has extended the base controller and will therefore have a given getAll method.
class SightingsController extends BaseController {
  constructor(model) {
    super(model);
  }

  // get all replace the baseController
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

  // Retrieve specific sighting
  getOne = async (req, res) => {
    const { sightingId } = req.params;
    try {
      const sighting = await this.model.findByPk(sightingId, {});
      return res.json(sighting);
    } catch (err) {
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

  // Edit a sighting
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
