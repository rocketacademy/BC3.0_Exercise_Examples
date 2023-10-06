import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { FirebaseContext } from "../App";

export default function Navigation(props) {
  // get all required firebase from context
  const firebase = useContext(FirebaseContext);
  const handleLogout = () => {
    // logs a user out
    signOut(firebase.auth).then(() => {
      // we update state to reflext isLoggedIn as false and the initial state of the user object
      props.setIsLoggedIn(false);
      props.setUser({});
    });
  };

  return (
    <div className="navigation-margin">
      {/* Links to give the users a way to navigate through the website */}
      <Link to="/">Home</Link>

      <Link to="/posts">Posts</Link>
      <Link to="/chat">Chat</Link>

      {/* If the user is logged in show logout, otherwise give them option to goto login page */}
      {props.isLoggedIn ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <Link to="/registration">Login Or Signup</Link>
      )}
    </div>
  );
}
