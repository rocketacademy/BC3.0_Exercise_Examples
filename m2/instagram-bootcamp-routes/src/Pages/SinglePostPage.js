import { useState, useContext } from "react";
import { update } from "firebase/database";
import thumb from "../Images/thumb.png";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../App";
import { useEffect } from "react";

export default function SinglePostsPage(props) {
  useEffect(() => {
    const messagesRef = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY
    );

    firebase.onChildChanged(messagesRef, (data) => {
      console.log(data);
      setMessage({ key: data.key, val: data.val() });
    });
  }, []);

  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(props.message);

  const likeCurrentPost = (e, post) => {
    const userId = props.user.uid;
    const itemToUpdate = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
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

  const handleAddComment = (e, post) => {
    const itemToUpdate = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY + "/" + post.key
    );
    console.log(itemToUpdate);
    const email = props.user.email;
    const updates = {};
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

  let messageListItems = (
    <li key={message.key}>
      <h3>
        {message.val.title} - {message.val.poster}
      </h3>
      {message.val.url ? (
        <img src={message.val.url} alt={message.val.title} />
      ) : null}
      <p>{message.val.message}</p>
      <p>{message.val.date}</p>
      <div className="likes">
        <div>
          {message.val.likes
            ? Object.values(message.val.likes).filter((item) => item !== false)
                .length
            : null}
        </div>
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
  );
  return (
    <div>
      <ol>{messageListItems}</ol>
      <button onClick={() => navigate("/posts")}>BACK</button>
    </div>
  );
}
