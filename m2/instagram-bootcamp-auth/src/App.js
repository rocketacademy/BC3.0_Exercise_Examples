import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
  onChildChanged,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { database, storage, auth } from "./firebase";

import logo from "./logo.png";
import thumb from "./Images/thumb.png";
import "./App.css";

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
      message: "",
      fileInputFile: null,
      fileInputValue: "",
      title: "",
      comment: "",
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

        // else {
        //   this.setState({
        //     isLoggedIn: false,
        //     user: {},
        //   });
        // }
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

  likeCurrentPost = (e, post) => {
    // right now the like is over ridding the previous like
    const userId = this.state.user.uid;
    const itemToUpdate = databaseRef(
      database,
      DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
    if (post.val.likes[`${userId}`]) {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: !post.val.likes[`${userId}`],
      };
    } else {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: true,
      };
    }
    return update(itemToUpdate, updates);
  };

  handleAddComment = (e, post) => {
    const itemToUpdate = databaseRef(
      database,
      DB_MESSAGES_KEY + "/" + post.key
    );
    const email = this.state.user.email;
    const updates = {};
    if (post.val.comments) {
      updates["comments"] = [
        ...post.val.comments,
        { comment: this.state.comment, date: `${new Date()}`, author: email },
      ];
    } else {
      updates["comments"] = [
        { comment: this.state.comment, date: `${new Date()}`, author: email },
      ];
    }

    this.setState({ comment: "" });
    return update(itemToUpdate, updates);
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);

    const storageRefInstance = storageRef(
      storage,
      STORAGE_IMAGE_KEY + this.state.fileInputFile.name
    );

    console.log(this.state.user);
    const username = this.state.user.email;

    uploadBytes(storageRefInstance, this.state.fileInputFile).then(() => {
      getDownloadURL(storageRefInstance).then((url) => {
        set(newMessageRef, {
          message: this.state.message,
          date: `${new Date()}`,
          url: url,
          title: this.state.title,
          likes: {},
          comments: [],
          poster: username,
        });

        this.setState({
          message: "",
          fileInputFile: null,
          fileInputValue: "",
          title: "",
          comment: "",
        });
      });
    });
  };

  render() {
    console.log(this.state.messages); // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
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
            {
              Object.values(message.val.likes).filter((item) => item !== false)
                .length
            }
          </div>
          {this.state.isLoggedIn ? (
            <button>
              <img
                className="like"
                src={thumb}
                alt="like"
                onClick={(e) => this.likeCurrentPost(e, message)}
              />
            </button>
          ) : null}
        </div>
        <label>Comments:</label> <br />
        {this.state.isLoggedIn ? (
          <>
            <input
              type="text"
              value={this.state.comment}
              onChange={this.handleChange}
              name="comment"
              placeholder="Add Comment"
            />
            <br />
            <button onClick={(e) => this.handleAddComment(e, message)}>
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
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {this.state.isLoggedIn ? (
            <>
              <h5>Welcome back {this.state.user.email}</h5>
              <button onClick={this.handleLogout}>Log Out</button>
              <div className="formInput">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={this.state.title}
                  placeholder="Add title here"
                  onChange={this.handleChange}
                />
              </div>
              <div className="formInput">
                <label>Message:</label>
                <input
                  type="text"
                  name="message"
                  value={this.state.message}
                  placeholder="Add message here"
                  onChange={this.handleChange}
                />
              </div>
              <div className="formInput">
                <label>Image:</label>
                <input
                  type="file"
                  value={this.state.fileInputValue}
                  onChange={(e) => {
                    this.setState({
                      fileInputFile: e.target.files[0],
                      fileInputValue: e.target.value,
                    });
                  }}
                />
              </div>
              <button onClick={this.writeData}>Send</button>
            </>
          ) : (
            <>
              <label>Email:</label>
              <input
                type="text"
                value={this.state.email}
                name="email"
                onChange={this.handleChange}
                placeholder="Add your email here"
              />
              <label>Password:</label>
              <input
                type="text"
                value={this.state.password}
                name="password"
                onChange={this.handleChange}
                placeholder="Add your password here"
              />
              <button onClick={this.handleSignup}>Signup</button>
              <button onClick={this.handleLogin}>Login </button>
            </>
          )}

          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
