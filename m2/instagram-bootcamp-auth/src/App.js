import React from "react";
import {
  onChildAdded,
  ref as databaseRef,
  onChildChanged,
} from "firebase/database";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { database, auth } from "./firebase";

import logo from "./logo.png";
import "./App.css";
import LoginSignup from "./Components/LoginSignup";
import PostComposer from "./Components/PostComposer";
import Post from "./Components/Post";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGE_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      isLoggedIn: false,
      email: "",
      password: "",
      user: {},
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));

      // onAuthStateChanged will return the user information if the user is logged in
      onAuthStateChanged(auth, (user) => {
        // if the user is logged in then update the current user state and set isLoggedIn to true
        if (user) {
          console.log(user);
          this.setState({
            isLoggedIn: true,
            user: user,
          });
        }
      });
    });

    // onChildChanged triggers if a child of the list is altered, it returns the altered childs new state
    onChildChanged(messagesRef, (data) => {
      let keyToUpdate = data.key;
      // We need to create a new array from the current state to avoid this issue - when you setState, if the object fed to setState is the same as the previous object, the component will not re-render. This applies even if values within the object were changed, meaning state will be updated but what you see on screen will not be updated.
      const currentMessageList = [...this.state.messages];
      // find the index of the key you need to update
      const index = currentMessageList.findIndex(
        (item) => item.key === keyToUpdate
      );
      // remove that item from the current messages and then replace it with the altered childs new state
      currentMessageList.splice(index, 1, { key: data.key, val: data.val() });
      // update the messages state
      this.setState({
        messages: currentMessageList,
      });
    });
  }

  // helper function to alter the input states
  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSignup = () => {
    // creates a new user, using the email and password protocol
    createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((user) => {
      // after we create a user, we update state to reflect isLoggedIn as true and the new user object
      if (user) {
        this.setState({ isLoggedIn: true, user: user.user });
      } else {
        console.log("User not logged in");
      }
      this.setState({
        email: "",
        password: "",
      });
    });
  };

  handleLogin = () => {
    // signs in a user, using the email and password protocol
    signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((user) => {
      // after we signin, we update state to reflect isLoggedIn as true and the new user object
      if (user) {
        this.setState({ isLoggedIn: true, user: user.user });
      } else {
        console.log("User not logged in");
      }
      this.setState({
        email: "",
        password: "",
      });
    });
  };

  handleLogout = () => {
    // logs a user out
    signOut(auth).then(() => {
      // we update state to reflext isLoggedIn as false and the initial state of the user object
      this.setState({
        isLoggedIn: false,
        user: {},
      });
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/*  when the user is logged in, show their email, a logout button and the post composter, otherwise show them the login form. Users can see the posts at all times.  */}
          {this.state.isLoggedIn ? (
            <>
              <h5>Welcome back {this.state.user.email}</h5>
              <button onClick={this.handleLogout}>Log Out</button>
              <PostComposer
                DB_MESSAGES_KEY={DB_MESSAGES_KEY}
                STORAGE_IMAGE_KEY={STORAGE_IMAGE_KEY}
                databaseRef={databaseRef}
                database={database}
                user={this.state.user}
              />
            </>
          ) : (
            <>
              <LoginSignup
                email={this.state.email}
                password={this.state.password}
                handleSignup={this.handleSignup}
                handleLogin={this.handleLogin}
                handleChange={this.handleChange}
              />
            </>
          )}

          <Post
            isLoggedIn={this.state.isLoggedIn}
            messages={this.state.messages}
            databaseRef={databaseRef}
            database={database}
            DB_MESSAGES_KEY={DB_MESSAGES_KEY}
            user={this.state.user}
          />
        </header>
      </div>
    );
  }
}

export default App;
