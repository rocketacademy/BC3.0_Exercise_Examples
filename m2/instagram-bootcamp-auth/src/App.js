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

      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user);
          this.setState({
            isLoggedIn: true,
            user: user,
          });
        }
      });
    });

    onChildChanged(messagesRef, (data) => {
      let keyToUpdate = data.key;
      const currentMessageList = [...this.state.messages];
      const index = currentMessageList.findIndex(
        (item) => item.key === keyToUpdate
      );
      currentMessageList.splice(index, 1, { key: data.key, val: data.val() });
      this.setState({
        messages: currentMessageList,
      });
    });
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSignup = () => {
    console.log("signup");
    createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((user) => {
      if (user) {
        console.log(user);
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
    console.log("login");
    signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((user) => {
      if (user) {
        console.log(user);
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
    signOut(auth).then(() => {
      console.log("signOut");
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
