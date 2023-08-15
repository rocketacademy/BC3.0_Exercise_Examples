import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SightingForm(props) {
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (props.edit) {
      // getSighting();

      // STATE WAY
      console.log(props);
      setLocation(props.sighting.location);
      setNotes(props.sighting.notes);
      setDate(props.sighting.date.slice(0, 10));
    }
  }, []);

  // API way
  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
    );
    setLocation(data.data.location);
    setNotes(data.data.notes);
    setDate(data.data.date.slice(0, 10));
    console.log(data);
  };

  const sendSighting = async () => {
    console.log(location, notes, date);
    await axios.post(`${process.env.REACT_APP_BACKEND_KEY}/sightings`, {
      location,
      notes,
      date,
    });
    setLocation("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  const editSighting = async () => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`,
      {
        location,
        notes,
        date,
      }
    );
    setLocation("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  return (
    <div>
      <label>Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location here"
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
