import React from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, set } from "firebase/database";
import { storage } from "../firebase";
import { useState, useContext } from "react";
import { FirebaseContext } from "../App";

export default function PostComposer(props) {
  const firebase = useContext(FirebaseContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [fileInputFile, setfileInputFile] = useState(null);
  const [fileInputValue, setfileInputValue] = useState("");

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = () => {
    const messageListRef = firebase.databaseRef(
      firebase.database,
      firebase.DB_MESSAGES_KEY
    );
    const newMessageRef = push(messageListRef);

    const storageRefInstance = storageRef(
      storage,
      firebase.STORAGE_IMAGE_KEY + fileInputFile.name
    );

    const username = props.user.email;

    uploadBytes(storageRefInstance, fileInputFile).then(() => {
      getDownloadURL(storageRefInstance).then((url) => {
        console.log(url);
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
        // comment?
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
