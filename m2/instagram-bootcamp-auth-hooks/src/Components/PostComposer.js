import React from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, set } from "firebase/database";
import { storage } from "../firebase";
import { useState } from "react";

export default function PostComposer(props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [fileInputFile, setfileInputFile] = useState(null);
  const [fileInputValue, setfileInputValue] = useState("");

  // Write the new message to the firebase realtime database
  const writeData = () => {
    // Get the list target on firebase we are targetting
    const messageListRef = props.databaseRef(
      props.database,
      props.DB_MESSAGES_KEY
    );
    // Add the new message into the list and get the reference to that new data
    const newMessageRef = push(messageListRef);

    // Get the storage ref for the image we are going to store
    const storageRefInstance = storageRef(
      storage,
      props.STORAGE_IMAGE_KEY + fileInputFile.name
    );

    const username = props.user.email;

    // Upload the image to firebase storage
    uploadBytes(storageRefInstance, fileInputFile).then(() => {
      //  When the file has been uploaded use the storage reference to get the url for the uploaded asset
      getDownloadURL(storageRefInstance).then((url) => {
        // Set this new message into the firebase realtime database
        set(newMessageRef, {
          message: message,
          date: `${new Date()}`,
          url: url,
          title: title,
          likes: {},
          comments: [],
          poster: username,
        });

        setMessage("");
        setfileInputFile(null);
        setfileInputValue("");
        setTitle("");
      });
    });
  };

  return (
    <div>
      <div className="formInput">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          placeholder="Add title here"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="formInput">
        <label>Message:</label>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Add message here"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="formInput">
        <label>Image:</label>
        <input
          type="file"
          value={fileInputValue}
          onChange={(e) => {
            setfileInputFile(e.target.files[0]);
            setfileInputValue(e.target.value);
          }}
        />
      </div>
      <button onClick={writeData}>Send</button>
    </div>
  );
}
