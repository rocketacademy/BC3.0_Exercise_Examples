import React from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, set } from "firebase/database";
import { storage } from "../firebase";

export default class PostComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      message: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  // Helper function to help handle the inputs on this component
  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Write the new message to the firebase realtime database
  writeData = () => {
    // Get the list target on firebase we are targetting
    const messageListRef = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY
    );
    // Add the new message into the list and get the reference to that new data
    const newMessageRef = push(messageListRef);

    // Get the storage ref for the image we are going to store
    const storageRefInstance = storageRef(
      storage,
      this.props.STORAGE_IMAGE_KEY + this.state.fileInputFile.name
    );

    const username = this.props.user.email;

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
    return (
      <div>
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
      </div>
    );
  }
}
