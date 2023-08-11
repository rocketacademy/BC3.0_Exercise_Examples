import PostComposer from "../Components/PostComposer";
import Posts from "../Components/Posts";
import { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../App";

function PostsPage(props) {
  const firebase = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY
    );
    // onChildAdded will return data for every child at the reference and every subsequent new child
    firebase.onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      // This part is the most hardests.
      setMessages((prevState) => {
        return [...prevState, { key: data.key, val: data.val() }];
      });
    });

    firebase.onChildChanged(messagesRef, (data) => {
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
          <PostComposer user={props.user} />
        </>
      ) : null}

      <Posts
        setSinglePost={props.setSinglePost}
        isLoggedIn={props.isLoggedIn}
        messages={messages}
        user={props.user}
      />
    </div>
  );
}

export default PostsPage;
