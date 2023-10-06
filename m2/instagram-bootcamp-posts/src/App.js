import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
  onChildChanged,
} from "firebase/database";
import thumb from "./Images/thumb.png";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "./firebase";
import logo from "./logo.png";
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

  // Like the current post by the currrent user
  likeCurrentPost = (e, post) => {
    // get the item within firebase that we need to update
    const itemToUpdate = databaseRef(
      database,
      DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
    // increment the liked value in firebase realtime database
    updates["likes"] = post.val.likes + 1;
    return update(itemToUpdate, updates);
  };

  // Allow users to add comments
  handleAddComment = (e, post) => {
    // get the item within firebase that we need to update
    const itemToUpdate = databaseRef(
      database,
      DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
    // if the post already has comments include these comments into the array and add the new comment else add this comment to the empty comments array
    if (post.val.comments) {
      updates["comments"] = [
        ...post.val.comments,
        { comment: this.state.comment, date: `${new Date()}` },
      ];
    } else {
      updates["comments"] = [
        { comment: this.state.comment, date: `${new Date()}` },
      ];
    }

    this.setState({ comment: "" });
    return update(itemToUpdate, updates);
  };

  // Write the new message to the firebase realtime database
  writeData = () => {
    // Get the list target on firebase we are targetting
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    // Add the new message into the list and get the reference to that new data
    const newMessageRef = push(messageListRef);

    // Get the storage ref for the image we are going to store
    const storageRefInstance = storageRef(
      storage,
      STORAGE_IMAGE_KEY + this.state.fileInputFile.name
    );

    // Upload the image to firebase storage
    uploadBytes(storageRefInstance, this.state.fileInputFile).then(() => {
      //  When the file has been uploaded use the storage reference to get the url for the uploaded asset
      getDownloadURL(storageRefInstance).then((url) => {
        // Set this new message into the firebase realtime database
        set(newMessageRef, {
          message: this.state.message,
          date: `${new Date()}`,
          url: url,
          title: this.state.title,
          likes: 0,
          comments: [],
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
    // display all messages
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        <h3>{message.val.title}</h3>
        {/* If the message has an image display the image */}
        {message.val.url ? (
          <img src={message.val.url} alt={message.val.title} />
        ) : null}
        <p>{message.val.message}</p>
        <p>{message.val.date}</p>
        {/* Display the total number of likes */}
        <div className="likes">
          <p>{message.val.likes}</p>
          <button>
            <img
              className="like"
              src={thumb}
              alt="like"
              onClick={(e) => this.likeCurrentPost(e, message)}
            />
          </button>
        </div>

        <label>Comment:</label>
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
        <ol>
          {/* display all of the comments for this post */}

          {message.val.comments && message.val.comments.length > 0 ? (
            message.val.comments.map((comment, i) => (
              <li key={i}>
                {comment.comment} - {comment.date}
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
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
