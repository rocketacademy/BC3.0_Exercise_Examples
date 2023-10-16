// React imports
import React from "react";
// React Router Dom imports
import { Outlet } from "react-router-dom";
// Import css and logo.
import "./App.css";
import logo from "../logo.png";

// Display the logo and use the outlet to display any components from the nested route.
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* Depending on the current URL within the browser, the Outlet will render the first matched nested route */}
        <Outlet />
      </header>
    </div>
  );
};

export default App;
