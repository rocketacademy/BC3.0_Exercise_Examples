// imported React
import React from "react";
// imported bootstrap
import Card from "react-bootstrap/Card";

// Display the card data within the title.
const ListingPreview = (props) => {
  return (
    <Card bg="dark">
      <Card.Body>
        <Card.Title>{props.data.title}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ListingPreview;
