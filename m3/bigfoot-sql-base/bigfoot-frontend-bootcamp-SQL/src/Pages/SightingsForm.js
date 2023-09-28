import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SightingForm(props) {
  const [locationDescription, setLocationDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (props.edit) {
      // getSighting();

      // STATE WAY
      console.log(props);
      setLocationDescription(props.sighting.locationDescription);
      setNotes(props.sighting.notes);
      setCity(props.sighting.city);
      setCountry(props.sighting.country);
      setDate(props.sighting.date.slice(0, 10));
    }
  }, []);

  // API way
  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
    );
    setLocationDescription(props.sighting.locationDescription);
    setNotes(props.sighting.notes);
    setCity(props.sighting.city);
    setCountry(props.sighting.country);
    setDate(data.data.date.slice(0, 10));
    console.log(data);
  };

  const sendSighting = async () => {
    await axios.post(`${process.env.REACT_APP_BACKEND_KEY}/sightings`, {
      locationDescription,
      city,
      country,
      notes,
      date,
    });
    setLocationDescription("");
    setCity("");
    setCountry("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  const editSighting = async () => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`,
      {
        locationDescription,
        city,
        country,
        notes,
        date,
      }
    );
    setLocationDescription("");
    setCity("");
    setCountry("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  return (
    <div>
      <label>Location</label>
      <input
        type="text"
        value={locationDescription}
        onChange={(e) => setLocationDescription(e.target.value)}
        placeholder="Enter location here"
      />
      <label>Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Enter country here"
      />
      <label>City</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city here"
      />
      <label>Notes</label>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter notes here"
      />
      <label>Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={props.edit ? editSighting : sendSighting}>
        {props.edit ? "Edit" : "Submit"}
      </button>
    </div>
  );
}
