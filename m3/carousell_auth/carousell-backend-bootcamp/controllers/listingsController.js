const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
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
    console.log(email);
    try {
      // TODO: Get seller email from auth, query Users table for seller ID

      // Create new listing

      const [user, created] = await this.userModel.findOrCreate({
        where: { email: email },
        defaults: {
          firstName: "Sam",
          lastName: "O",
          phoneNum: 98377849,
        },
      });

      console.log("getting here");
      await created;
      // if (created) {
      console.log(user.id);

      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: user.id, // TODO: Replace with seller ID of authenticated seller
      });
      console.log(newListing);

      // Respond with new listing
      return res.json(newListing);
      // } else {
      //   console.log('FAILED')
      //   return res.json("Failed");
      // }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific listing. No authentication required.
  async getOne(req, res) {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Buy specific listing. Requires authentication.
  async buyItem(req, res) {
    const { listingId } = req.params;
    console.log(req.body);
    const email = req.body.user.email;

    const [user, created] = await this.userModel.findOrCreate({
      where: { email: email },
      defaults: {
        firstName: "test",
        lastName: "test",
        phoneNum: 27300833,
      },
    });

    await created;
    try {
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      await data.update({ buyerId: user.id }); // TODO: Replace with buyer ID of authenticated buyer

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
