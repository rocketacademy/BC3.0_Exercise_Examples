import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SightingCard from "../Components/SightingCard";
function Sightings(props) {
  const [sightings, setSightings] = useState([]);

  const getSightings = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings`
    );
    console.log(data.data);
    setSightings(data.data);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getSightings();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="flexCenter">
          {sightings && sightings.length > 0 ? (
            sightings.map((sighting) => {
              return (
                <div className="card" key={sighting.id}>
                  <SightingCard sighting={sighting} />
                  <Link to={`/sighting/${sighting.id}`}>More Details</Link>
                  <button
                    onClick={() => {
                      props.setSighting(sighting);
                      navigate(`/sighting/${sighting.id}/edit`);
                    }}
                  >
                    Edit me
                  </button>
                </div>
              );
            })
          ) : (
            <p>No data</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Sightings;
