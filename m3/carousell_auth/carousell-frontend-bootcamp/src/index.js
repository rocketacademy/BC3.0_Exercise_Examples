// React imports
import React from "react";
import ReactDOM from "react-dom/client";

// React Router Dom imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth0 Imports
import { Auth0Provider } from "@auth0/auth0-react";

// Bootstrap and CSS setup
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Required components/ pages
import App from "./components/App";
import Home from "./components/Home";
import NewListingForm from "./components/NewListingForm";
import Listing from "./components/Listing";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // Auth0 provider allows all children to access the auth0 hooks
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN}
    clientId={process.env.REACT_APP_CLIENTID}
    redirectUri={process.env.REACT_APP_REDIRECTURI}
    audience={process.env.REACT_APP_AUDIENCE}
    scope={process.env.REACT_APP_SCOPE}
  >
    {/* BrowserRouter allows all children to activate and use history within React Router Dom */}
    <BrowserRouter>
      <Routes>
        {/* Route that provides base app UI */}
        {/* Notive that all subsequent Route are nested in the Route below to facilitate nested routing */}
        <Route path="/" element={<App />}>
          {/* Route that renders home content */}
          <Route index element={<Home />} />
          {/* Route that renders new listing form */}
          <Route path="listings/new" element={<NewListingForm />} />
          {/* Route that renders individual listings */}
          <Route path="listings/:listingId" element={<Listing />} />
          {/* Route that matches all other paths */}
          <Route path="*" element={"Nothing here!"} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Auth0Provider>
);
