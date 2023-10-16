// Import Axios
import axios from "axios";
// All React Imports
import React, { useEffect, useState } from "react";
// React Router Dom imports
import { Link, useParams } from "react-router-dom";
// Bootstrap button
import Button from "react-bootstrap/Button";
// Bootstrap card
import Card from "react-bootstrap/Card";
// Import auth0 hook
import { useAuth0 } from "@auth0/auth0-react";
// Import constant information
import { BACKEND_URL } from "../constants.js";

// Show full listing and allow the user to buy if they are logged in.
const Listing = () => {
  const [listingId, setListingId] = useState();
  const [listing, setListing] = useState({});
  const [userInfo, setUserInfo] = useState({});

  // Setup auth0 so that we can full utilise authentication.
  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
    useAuth0();

  useEffect(() => {
    // If there is a listingId, then retrieve the listing data
    if (listingId) {
      axios.get(`${BACKEND_URL}/listings/${listingId}`).then((response) => {
        setListing(response.data);
      });
    }

    // Only run this effect on change to listingId
  }, [listingId]);

  useEffect(() => {
    // If the user is logged in set thier information in state, otherwise, ask them to login
    if (isAuthenticated) {
      setUserInfo(user);
    } else {
      loginWithRedirect();
    }
  }, []);

  // Update listing ID in state if needed to trigger data retrieval
  const params = useParams();
  if (listingId !== params.listingId) {
    setListingId(params.listingId);
  }

  // Store a new JSX element for each property in listing details
  const listingDetails = [];
  if (listing) {
    for (const key in listing) {
      listingDetails.push(
        <Card.Text key={key}>{`${key}: ${listing[key]}`}</Card.Text>
      );
    }
  }

  // When the user clicks on the buy button reflect the alteration in the database.
  const handleClick = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUDIENCE,
      scope: process.env.REACT_APP_SCOPE,
    });
    axios
      .put(
        `${BACKEND_URL}/listings/${listingId}/buy`,
        { user: userInfo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setListing(response.data);
      });
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <Card bg="dark">
        <Card.Body>
          {listingDetails}
          {/* If there is already a buyer, you cannot press the buy button */}
          <Button onClick={handleClick} disabled={listing.BuyerId}>
            Buy
          </Button>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
};

export default Listing;
