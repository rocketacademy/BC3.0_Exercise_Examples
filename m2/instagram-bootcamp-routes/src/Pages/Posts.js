import {
  onChildAdded,
  ref as databaseRef,
  onChildChanged,
} from "firebase/database";
import { database } from "../firebase";
import PostComposer from "../Components/PostComposer";
import Post from "../Components/Post";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGE_KEY = "images";

function Posts(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      // This part is the most hardests.
      setMessages((prevState) => {
        return [...prevState, { key: data.key, val: data.val() }];
      });
    });

    onChildChanged(messagesRef, (data) => {
      setMessages((prevState) => {
        let keyToUpdate = data.key;
        const currentMessageList = [...prevState];
        const index = currentMessageList.findIndex(
          (item) => item.key === keyToUpdate
        );
        currentMessageList.splice(index, 1, { key: data.key, val: data.val() });
        return currentMessageList;
      });
    });
  }, []);

  return (
    <div>
      {props.isLoggedIn ? (
        <>
          <h5>Welcome back {props.user.email}</h5>
          <PostComposer
            DB_MESSAGES_KEY={DB_MESSAGES_KEY}
            STORAGE_IMAGE_KEY={STORAGE_IMAGE_KEY}
            databaseRef={databaseRef}
            database={database}
            user={props.user}
          />
        </>
      ) : null}

      <Post
        isLoggedIn={props.isLoggedIn}
        messages={messages}
        databaseRef={databaseRef}
        database={database}
        DB_MESSAGES_KEY={DB_MESSAGES_KEY}
        user={props.user}
      />
    </div>
  );
}

export default Posts;
