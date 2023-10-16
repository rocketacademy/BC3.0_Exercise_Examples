const BaseController = require("./baseController");

// Category controller has extended the base controller and will therefore have a given getAll method.
class CategoryController extends BaseController {
  // inject the sightings_category model for eager loading
  constructor(model, sightings_category) {
    super(model);
    this.sightings_category = sightings_category;
  }

  // add a new category into the applicaiton's database
  newCategory = async (req, res) => {
    const category = req.body;
    try {
      const data = await this.model.create({
        ...category,
      });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // create a new association within sightings_categories, adding in the intensity of the weather
  addCategory = async (req, res) => {
    const sightingId = req.params.id;
    const intensity = req.body.intensity;
    const categoryId = req.body.categoryId;
    try {
      const data = await this.sightings_category.create({
        sightingId: sightingId,
        categoryId: categoryId,
        intensity: intensity,
      });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Edit a current association's intensity that is recorded in database
  editCategory = async (req, res) => {
    const sightingId = req.params.id;
    const intensity = req.body.intensity;
    const categoryId = req.body.categoryId;
    const intensityId = req.body.sightingCategoryId;
    try {
      const data = await this.sightings_category.update(
        {
          sightingId: sightingId,
          categoryId: categoryId,
          intensity: intensity,
        },
        {
          where: { id: intensityId },
        }
      );
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = CategoryController;
