import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { FirebaseContext } from "../App";

export default function Navigation(props) {
  const firebase = useContext(FirebaseContext);
  const handleLogout = () => {
    signOut(firebase.auth).then(() => {
      props.setIsLoggedIn(false);
      props.setUser({});
    });
  };

  return (
    <div className="navigation-margin">
      <Link to="/">Home</Link>

      <Link to="/posts">Posts</Link>
      <Link to="/chat">Chat</Link>

      {props.isLoggedIn ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <Link to="/registration">Login Or Signup</Link>
      )}
    </div>
  );
}
