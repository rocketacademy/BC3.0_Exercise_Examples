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
  // intialise the state that will be used throughout the application
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

    // onAuthStateChanged will return the user information if the user is logged in
    onAuthStateChanged(auth, (user) => {
      // if the user is logged in then update the current user state and set isLoggedIn to true
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUser(user);
      }
    });

    // onChildChanged triggers if a child of the list is altered, it returns the altered childs new state
    onChildChanged(messagesRef, (data) => {
      // update the messages state
      setMessages((prevState) => {
        let keyToUpdate = data.key;
        // We need to create a new array from the current state to avoid this issue - when you setState, if the object fed to setState is the same as the previous object, the component will not re-render. This applies even if values within the object were changed, meaning state will be updated but what you see on screen will not be updated.
        const currentMessageList = [...prevState];
        // find the index of the key you need to update
        const index = currentMessageList.findIndex(
          (item) => item.key === keyToUpdate
        );
        // remove that item from the current messages and then replace it with the altered childs new state
        currentMessageList.splice(index, 1, { key: data.key, val: data.val() });
        return currentMessageList;
      });
    });
  }, []);

  const handleLogout = () => {
    // logs a user out
    signOut(auth).then(() => {
      // we update state to reflext isLoggedIn as false and the initial state of the user object
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
        {/*  when the user is logged in, show their email, a logout button and the post composter, otherwise show them the login form. Users can see the posts at all times.  */}

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
