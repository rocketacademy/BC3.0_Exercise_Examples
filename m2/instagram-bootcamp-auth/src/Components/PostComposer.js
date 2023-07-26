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

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY
    );
    const newMessageRef = push(messageListRef);

    const storageRefInstance = storageRef(
      storage,
      this.props.STORAGE_IMAGE_KEY + this.state.fileInputFile.name
    );

    const username = this.props.user.email;

    uploadBytes(storageRefInstance, this.state.fileInputFile).then(() => {
      getDownloadURL(storageRefInstance).then((url) => {
        console.log(url);
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
