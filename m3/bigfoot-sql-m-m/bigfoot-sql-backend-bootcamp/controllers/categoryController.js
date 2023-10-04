const BaseController = require("./baseController");

class CategoryController extends BaseController {
  constructor(model, sightings_category) {
    super(model);
    this.sightings_category = sightings_category;
  }

  newCategory = async (req, res) => {
    const category = req.body;
    console.log(category);

    try {
      const data = await this.model.create({
        ...category,
      });

      console.log("response from db", data);
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  addCategory = async (req, res) => {
    console.log(req.params);
    const sightingId = req.params.id;
    const intensity = req.body.intensity;
    const categoryId = req.body.categoryId;

    console.log(req.body);

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

  editCategory = async (req, res) => {
    const sightingId = req.params.id;
    const intensity = req.body.intensity;
    const categoryId = req.body.categoryId;
    const intensityId = req.body.sightingCategoryId;

    console.log(req.body);

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

  // make an edit category route
}

module.exports = CategoryController;
