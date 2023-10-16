// React imports
import React from "react";

// React Router Dom imports
import { Link } from "react-router-dom";

// Imported custom Components
import ListingPreviewList from "./ListingPreviewList";

// Auth0 imported hook
import { useAuth0 } from "@auth0/auth0-react";

// React-Bootstrap button
import Button from "react-bootstrap/esm/Button";

// Home component, if the user is logged in, showcase the logout button, if they are not logged in show the login button.
// Always show the preview list of items.
const Home = () => {
  const { logout, isAuthenticated, loginWithRedirect } = useAuth0();
  // Margin style block to pass into Bootstrap button.
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
