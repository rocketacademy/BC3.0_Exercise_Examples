import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SightingCard from "../Components/SightingCard";

function Sighting(props) {
  const [sighting, setSighting] = useState({});

  const params = useParams();
  console.log(params);

  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sighting/${params.sightingId}`
    );
    setSighting(data.data);
  };

  useEffect(() => {
    getSighting();
  }, []);

  return (
    <div>
      <SightingCard
        full
        sighting={sighting}
        setEditSighting={props.setEditSighting}
        searchParams={params.sightingId}
      />
    </div>
  );
}

export default Sighting;
