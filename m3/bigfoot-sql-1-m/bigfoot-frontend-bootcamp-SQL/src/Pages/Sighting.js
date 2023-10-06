import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SightingCard from "../Components/SightingCard";

function Sighting() {
  const [sighting, setSighting] = useState({});
  const [comment, setComment] = useState("");

  // Api request to create a new commnet
  const sendComment = async () => {
    let data = await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}/comments`,
      {
        content: comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
    setComment("");
    getSighting();
  };

  // Api request to delete a comment by its id
  const deleteComment = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${id}/comments`
    );
    getSighting();
  };

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
