import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SightingCard from "../Components/SightingCard";

function Sighting() {
  const [sighting, setSighting] = useState({});
  const [comment, setComment] = useState("");

  const sendComment = async () => {
    let data = await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}/comments`,
      {
        content: comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    console.log(data);
    setComment("");
    getSighting();
  };

  const deleteComment = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${id}/comments`
    );
    getSighting();
  };

  const params = useParams();

  const getSighting = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
    );
    console.log("singleSighting", data);
    setSighting(data.data);
  };

  useEffect(() => {
    getSighting();
  }, []);

  return (
    <div>
      <SightingCard
        full
        sendComment={sendComment}
        comment={comment}
        setComment={setComment}
        sighting={sighting}
        deleteComment={deleteComment}
        getSighting={getSighting}
      />
    </div>
  );
}

export default Sighting;
