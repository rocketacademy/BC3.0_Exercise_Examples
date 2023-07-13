import React from "react";

class CardComponent extends React.Component {
  // import every image from the Assets folder
  importAll = (r) => {
    let images = {};
    r.keys().map((item) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };

  render() {
    // access the images to be used to display each card
    const images = this.importAll(require.context("../Assets", false, /.png/));
    // get the image name required to display the image
    let img = `${this.props.name.toLowerCase()}_of_${this.props.suit.toLowerCase()}.png`;
    return (
      <div className="card">
        <img src={images[img]} alt="2 spades" />
        <h2>Player {this.props.player + 1}</h2>
        <p>
          {this.props.name} of {this.props.suit}
        </p>
      </div>
    );
  }
}

export default CardComponent;
