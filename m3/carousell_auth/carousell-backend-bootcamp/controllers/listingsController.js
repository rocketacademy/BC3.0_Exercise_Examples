const BaseController = require("./baseController");

// Listing controller extends the base contorller, so that it contains the getAll method.
class ListingsController extends BaseController {
  // inject the userModel as a dependency injection so that we can access the users in association to the listed item.
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  async insertOne(req, res) {
    const {
      title,
      category,
      condition,
      price,
      description,
      shippingDetails,
      email,
    } = req.body;
    try {
      // Create a new user is one has not been made - CHECK THIS
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: email },
        //  Could capture this information from users if you created a form in the frontend and stored information into DB.
        defaults: {
          firstName: "Sam",
          lastName: "O",
          phoneNum: 98377849,
        },
      });

      await created;

      // create a new listing with the user associated within.
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: user.id,
      });

      return res.json(newListing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific listing
  async getOne(req, res) {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Buy specific listing
  async buyItem(req, res) {
    const { listingId } = req.params;
    const email = req.body.user.email;

    // Find a or create the user withi this email
    const [user, created] = await this.userModel.findOrCreate({
      where: { email: email },
      //  Could capture this information from users if you created a form in the frontend and stored information into DB.
      defaults: {
        firstName: "Sam",
        lastName: "O",
        phoneNum: 98377849,
      },
    });

    await created;

    // Use this user information add a new listing into the database
    try {
      const data = await this.model.findByPk(listingId);
      await data.update({ buyerId: user.id });

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
