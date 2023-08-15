import logo from "./logo.png";
import "./App.css";
import { Link, Routes, Route } from "react-router-dom";
import Sightings from "./Pages/Sightings";
import Sighting from "./Pages/Sighting";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Link to="/sightings">Home</Link>
        </div>

        <h1> Welcome class</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <Routes>
          <Route path="/sightings" element={<Sightings />} />
          <Route path="/sighting/:sightingId" element={<Sighting />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
