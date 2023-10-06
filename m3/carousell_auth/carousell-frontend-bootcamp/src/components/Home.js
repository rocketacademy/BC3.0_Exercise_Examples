import React from "react";
import { Link } from "react-router-dom";

import ListingPreviewList from "./ListingPreviewList";

import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/esm/Button";

const Home = () => {
  const { logout, isAuthenticated, loginWithRedirect } = useAuth0();
  const margin = { margin: "10px" };
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <Button style={margin}>
            <Link
              style={{ color: "#fff", textDecoration: "none" }}
              to="/listings/new"
            >
              Sell
            </Link>
          </Button>
          <Button onClick={logout}>Logout</Button>
        </div>
      ) : (
        <div>
          <Button onClick={loginWithRedirect}>login</Button>
        </div>
      )}
      <br />
      <br />
      <ListingPreviewList />
    </div>
  );
};

export default Home;
