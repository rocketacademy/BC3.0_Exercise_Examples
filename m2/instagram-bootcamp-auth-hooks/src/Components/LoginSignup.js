import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useState } from "react";

// Hanlde state and firebase login functions from this component as opposed to being passed down as props
export default function LoginSignup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log("signup");
    createUserWithEmailAndPassword(props.auth, email, password).then((user) => {
      if (user) {
        console.log(user);
        props.setIsLoggedIn(true);
        props.setUser(user.user);
      } else {
        console.log("User not logged in");
      }
      setEmail("");
      setPassword("");
    });
  };

  const handleLogin = () => {
    console.log("login");
    signInWithEmailAndPassword(props.auth, email, password).then((user) => {
      if (user) {
        props.setIsLoggedIn(true);
        props.setUser(user.user);
      } else {
        console.log("User not logged in");
      }
      setEmail("");
      setPassword("");
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
        onChange={(e) => setPassword(e)}
        placeholder="Add your password here"
      />
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login </button>
    </div>
  );
}
