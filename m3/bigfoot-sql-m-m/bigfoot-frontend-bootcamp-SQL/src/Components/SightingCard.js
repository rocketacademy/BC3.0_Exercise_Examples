import { useState } from "react";
import EditComment from "./EditComment";
import axios from "axios";

export default function SightingCard(props) {
  const [editingComment, setEditingComment] = useState("");
  const [editing, setEditing] = useState(false);

  const likeSighting = async () => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/like/${props.sighting.id}/`
    );

    props.getSighting();
  };

  const editComment = async (comment) => {
    console.log(comment);
    await axios.put(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${comment.id}/comments`,
      {
        content: comment.content,
        updatedAt: new Date(),
      }
    );
    setEditing(false);
    setEditingComment("");
    console.log("props", props);
    props.getSighting();
  };

  return (
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div key={props.sighting.id}>
          <h2>{props.sighting.country}</h2>
          <h3>{props.sighting.city}</h3>
          <h4>{props.sighting.locationDescription}</h4>
          <p>Date: {new Date(`${props.sighting.date}`).toLocaleDateString()}</p>

          {props.sighting.categories && props.sighting.categories.length > 0
            ? props.sighting.categories.map((item) => {
                return (
                  <p key={item.id} className="tag flexCenter">
                    {item.name} - {item.sighting_category.intensity}
                  </p>
                );
              })
            : null}

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

              {!editing ? (
                <div>
                  <label>New Comment:</label>
                  <input
                    type="text"
                    value={props.comment}
                    onChange={(e) => props.setComment(e.target.value)}
                  />
                  <button onClick={props.sendComment}>Submit</button>

                  {props.sighting.comments &&
                  props.sighting.comments.length > 0 ? (
                    props.sighting.comments.map((item) => (
                      <div key={item.id}>
                        <p>{item.content}</p>
                        {/* capture edited comment */}

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
