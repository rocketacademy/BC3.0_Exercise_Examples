import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SightingCard from "../Components/SightingCard";
function Sightings(props) {
  const [sightings, setSightings] = useState([]);

  // API call to get the sightings from the backend
  const getSightings = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings`
    );
    console.log(data.data);
    setSightings(data.data);
  };

  // Setting up navigate hook
  const navigate = useNavigate();

  useEffect(() => {
    getSightings();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="flexCenter">
          {/* if there are sightings and sightings length is greater than 0 then we display each sighting using a sighting card */}
          {sightings && sightings.length > 0 ? (
            sightings.map((sighting) => {
              return (
                <div className="card" key={sighting.id}>
                  <SightingCard sighting={sighting} />
                  {/* button to navigate to the single sighting information */}
                  <Link to={`/sighting/${sighting.id}`}>More Details</Link>
                  {/* button to edit this particular sighting  */}
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
