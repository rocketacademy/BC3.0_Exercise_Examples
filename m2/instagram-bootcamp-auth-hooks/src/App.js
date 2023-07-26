import {
  onChildAdded,
  ref as databaseRef,
  onChildChanged,
} from "firebase/database";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { database, auth } from "./firebase";

import logo from "./logo.png";
import "./App.css";
import LoginSignup from "./Components/LoginSignup";
import PostComposer from "./Components/PostComposer";
import Post from "./Components/Post";

import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGE_KEY = "images";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

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

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUser(user);
      }
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

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUser({});
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {isLoggedIn ? (
          <>
            <h5>Welcome back {user.email}</h5>
            <button onClick={handleLogout}>Log Out</button>
            <PostComposer
              DB_MESSAGES_KEY={DB_MESSAGES_KEY}
              STORAGE_IMAGE_KEY={STORAGE_IMAGE_KEY}
              databaseRef={databaseRef}
              database={database}
              user={user}
            />
          </>
        ) : (
          <>
            <LoginSignup auth={auth} />
          </>
        )}

        <Post
          isLoggedIn={isLoggedIn}
          messages={messages}
          databaseRef={databaseRef}
          database={database}
          DB_MESSAGES_KEY={DB_MESSAGES_KEY}
          user={user}
        />
      </header>
    </div>
  );
}

export default App;
