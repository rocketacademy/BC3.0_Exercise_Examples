// Import Axios
import axios from "axios";
// All React Imports
import React, { useEffect, useState } from "react";
// React Router Dom Imports
import { Link } from "react-router-dom";

// Custom Component import
import ListingPreview from "./ListingPreview";
// Get the constant information
import { BACKEND_URL } from "../constants.js";

// Component that will go and get the listings on load, then it will display the items on using the ListingPreview component.
const ListingPreviewList = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/listings`).then((response) => {
      setListings(response.data);
    });
    // Only run this effect on component mount
  }, []);

  const listingPreviews = listings.map((listing) => (
    <Link to={`/listings/${listing.id}`} key={listing.id}>
      <ListingPreview data={listing} />
    </Link>
  ));

  return <div>{listingPreviews}</div>;
};

export default ListingPreviewList;
