import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { FirebaseContext } from "../App";

export default function LoginSignup(props) {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log("signup");
    createUserWithEmailAndPassword(firebase.auth, email, password).then(
      (user) => {
        if (user) {
          console.log(user);
          props.setIsLoggedIn(true);
          props.setUser(user.user);
        } else {
          console.log("User not logged in");
        }
        setEmail("");
        setPassword("");
        navigate("/posts");
      }
    );
  };

  const handleLogin = () => {
    console.log("login");
    signInWithEmailAndPassword(firebase.auth, email, password).then((user) => {
      if (user) {
        props.setIsLoggedIn(true);
        props.setUser(user.user);
      } else {
        console.log("User not logged in");
      }
      setEmail("");
      setPassword("");
      navigate("/posts");
    });
  };

  return (
    <div>
      <label>Email:</label>
      <input
        type="text"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Add your email here"
      />
      <label>Password:</label>
      <input
        type="text"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Add your password here"
      />
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login </button>
    </div>
  );
}
