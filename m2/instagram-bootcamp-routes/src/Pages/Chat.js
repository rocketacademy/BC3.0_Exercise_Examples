import { useEffect, useState } from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { useContext } from "react";
import { FirebaseContext } from "../App";

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const messagesRef = ref(firebase.database, firebase.DB_CHAT_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) => {
        return [...prevState, { key: data.key, val: data.val() }];
      });
    });
  }, []);

  const writeData = () => {
    const messageListRef = ref(firebase.database, firebase.DB_CHAT_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: message,
      date: `${new Date()}`,
      user: props.user.email,
    });
    setMessage("");
  };

  let messageListItems = messages.map((message) => (
    <li key={message.key}>
      <p>{message.val.message}</p>
      <p>{message.val.date}</p>
      <p>{message.val.user}</p>
    </li>
  ));

  return (
    <>
      <h1>Chat </h1>

      {props.isLoggedIn ? (
        <>
          <input
            type="text"
            name="message"
            value={message}
            placeholder="Add message here"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => writeData()}>Send</button>{" "}
        </>
      ) : null}

      <ol>{messageListItems}</ol>
    </>
  );
}
