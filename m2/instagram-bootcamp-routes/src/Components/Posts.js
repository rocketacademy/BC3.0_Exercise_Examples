import React from "react";
import thumb from "../Images/thumb.png";
import { update } from "firebase/database";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../App";

export default function Post(props) {
  const [comment, setComment] = useState("");
  // Grabe the firebase features from context
  const firebase = useContext(FirebaseContext);

  // Like the current post by the currrent user
  const likeCurrentPost = (e, post) => {
    const userId = props.user.uid;
    // get the item within firebase that we need to update
    const itemToUpdate = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
    // check to see if the user has liked or not, add the truthy value for this user or toggle the value
    if (!post.val.likes) {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: true,
      };
    } else {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: !post.val.likes[`${userId}`],
      };
    }
    return update(itemToUpdate, updates);
  };

  // Allow users to add comments
  const handleAddComment = (e, post) => {
    // get the item within firebase that we need to update
    const itemToUpdate = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY + "/" + post.key
    );
    const email = props.user.email;
    const updates = {};
    // if the post already has comments include these comments into the array and add the new comment else add this comment to the empty comments array
    if (post.val.comments) {
      updates["comments"] = [
        ...post.val.comments,
        { comment: comment, date: `${new Date()}`, author: email },
      ];
    } else {
      updates["comments"] = [
        { comment: comment, date: `${new Date()}`, author: email },
      ];
    }

    setComment("");
    return update(itemToUpdate, updates);
  };

  // display all messages given as props
  let messageListItems = props.messages.map((message) => (
    <li key={message.key}>
      <Link
        to={`/posts/${message.key}`}
        onClick={() => props.setSinglePost(message)}
      >
        <h3>
          {message.val.title} - {message.val.poster}
        </h3>
      </Link>
      {/* If the message has an image display the image */}
      {message.val.url ? (
        <img src={message.val.url} alt={message.val.title} />
      ) : null}
      <p>{message.val.message}</p>
      <p>{message.val.date}</p>
      <div className="likes">
        <div>
          {/* Display the total number of likes */}
          {message.val.likes
            ? Object.values(message.val.likes).filter((item) => item !== false)
                .length
            : null}
        </div>
        {/* If the user is logged in allow them to like the post by adding a button */}
        {props.isLoggedIn ? (
          <button>
            <img
              className="like"
              src={thumb}
              alt="like"
              onClick={(e) => likeCurrentPost(e, message)}
            />
          </button>
        ) : null}
      </div>
      <label>Comments:</label> <br />
      {/* If the user is logged in allow them to add comments  */}
      {props.isLoggedIn ? (
        <>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            name="comment"
            placeholder="Add Comment"
          />
          <br />
          <button onClick={(e) => handleAddComment(e, message)}>
            Add Comment
          </button>
        </>
      ) : null}
      <ol>
        {/* display all of the comments for this post */}
        {message.val.comments && message.val.comments.length > 0 ? (
          message.val.comments.map((comment, i) => (
            <li key={i}>
              {comment.comment} - {comment.date} - {comment.author}
            </li>
          ))
        ) : (
          <p>No Comments</p>
        )}
      </ol>
    </li>
  ));
  return (
    <div>
      <ol>{messageListItems}</ol>
    </div>
  );
}
