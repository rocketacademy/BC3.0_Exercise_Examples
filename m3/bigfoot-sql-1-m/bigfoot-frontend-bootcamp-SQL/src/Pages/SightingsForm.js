import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SightingForm(props) {
  // state to handle  the form
  const [locationDescription, setLocationDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // router hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (props.edit) {
      // API way
      // getSighting();

      // Prop way
      setLocationDescription(props.sighting.locationDescription);
      setNotes(props.sighting.notes);
      setCity(props.sighting.city);
      setCountry(props.sighting.country);
      setDate(props.sighting.date.slice(0, 10));
    }
  }, []);

  // API way to set data
  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
    );
    setLocationDescription(data.data.locationDescription);
    setNotes(data.data.notes);
    setCity(data.data.city);
    setCountry(data.data.country);
    setDate(data.data.date.slice(0, 10));
  };

  // Api request to make a new sighting
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

  // Api request to edit an existing sighting
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
      {/* Depending on the prop value this component is given, it will either be editing or sending a new sighting */}
      <button onClick={props.edit ? editSighting : sendSighting}>
        {props.edit ? "Edit" : "Submit"}
      </button>
    </div>
  );
}
