import logo from "./logo.png";
import "./App.css";
import { Link, Routes, Route } from "react-router-dom";
import Sightings from "./Pages/SightingsLegacy";
import Sighting from "./Pages/Sighting";
import SightingsForm from "./Pages/SightingsForm";
import { useState } from "react";

function App() {
  const [sighting, setSighting] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Link to="/sightings">Home</Link>
          <Link to="/new-sighting">New Sighting</Link>
        </div>

        <h1> Welcome class</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <Routes>
          <Route
            path="/sightings"
            element={<Sightings setSighting={setSighting} />}
          />
          <Route path="/new-sighting" element={<SightingsForm />} />
          <Route path="/sighting/:sightingId" element={<Sighting />} />
          <Route
            path="/sighting/:sightingId/edit"
            element={<SightingsForm edit sighting={sighting} />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
