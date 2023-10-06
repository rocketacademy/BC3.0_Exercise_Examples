import { useState } from "react";
import EditComment from "./EditComment";
import axios from "axios";

export default function SightingCard(props) {
  const [editingComment, setEditingComment] = useState("");
  const [editing, setEditing] = useState(false);

  // Api requiest to like post by sightindId
  const likeSighting = async () => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/like/${props.sighting.id}/`
    );
    // After we have liked the post go retreive the sightings again.
    props.getSighting();
  };

  // Api requiest to edit comment by comment id
  const editComment = async (comment) => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${comment.id}/comments`,
      {
        content: comment.content,
        updatedAt: new Date(),
      }
    );
    // After we have made the request to edit the comment, we try to get the sighting again to render the updated information
    setEditing(false);
    setEditingComment("");
    props.getSighting();
  };

  return (
    // Depending choose class name full dependent on prop passed
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div>
          <h2>{props.sighting.country}</h2>
          <h3>{props.sighting.city}</h3>
          <h4>{props.sighting.locationDescription}</h4>
          <p>Date: {new Date(`${props.sighting.date}`).toLocaleDateString()}</p>
          {/* If the prop is full then showcase the like button, total likes*/}
          {props.full ? (
            <div>
              <button onClick={likeSighting}>Like</button>
              <h3>
                Total likes:
                {props.sighting.likes && props.sighting.likes.length > 0
                  ? props.sighting.likes.length
                  : "No likes yet"}
              </h3>
              <p>{props.sighting.notes}</p>

              <h4>Comments:</h4>

              {/* If the comment is not being edited show case the new comment form, allowing users to add comments */}
              {!editing ? (
                <div>
                  <label>New Comment:</label>
                  <input
                    type="text"
                    value={props.comment}
                    onChange={(e) => props.setComment(e.target.value)}
                  />
                  <button onClick={props.sendComment}>Submit</button>

                  {/* display all comments onto the page */}
                  {props.sighting.comments &&
                  props.sighting.comments.length > 0 ? (
                    props.sighting.comments.map((item) => (
                      <div key={item.id}>
                        <p>{item.content}</p>
                        {/* Set editing to true  */}
                        <button
                          onClick={() => {
                            setEditing(true);
                            setEditingComment(item);
                          }}
                        >
                          Edit
                        </button>

                        <button onClick={() => props.deleteComment(item.id)}>
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No comments</p>
                  )}
                </div>
              ) : (
                // If editing is true render the edit comment component along with all of the information it requires
                <EditComment
                  editingComment={editingComment}
                  editComment={editComment}
                  setEditingComment={setEditingComment}
                />
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
