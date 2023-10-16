import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SightingCard from "../Components/SightingCard";

function Sighting() {
  const [sighting, setSighting] = useState({});

  // router hook
  const params = useParams();

  // Api request to get a single sighting by id
  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
    );
    setSighting(data.data);
  };

  useEffect(() => {
    getSighting();
  }, []);

  return (
    <div>
      <SightingCard full sighting={sighting} />
    </div>
  );
}

export default Sighting;
